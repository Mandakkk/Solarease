/**
 * Facebook Messenger Webhook
 *
 * Энэ route 2 төрлийн request хүлээж авна:
 *
 * 1. GET  — Facebook webhook баталгаажуулах (page-тэй холбоход 1 удаа)
 * 2. POST — Шинэ мессеж ирэх бүрд (хэрэглэгч Solar Ease рүү бичсэн үед)
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { generateReply } from "@/lib/claude";
import {
  sendTextMessage,
  sendTypingIndicator,
  markMessageAsSeen,
} from "@/lib/facebook";
import {
  getSession,
  appendUserMessage,
  appendAssistantMessage,
  isHandedOffToHuman,
  markHandedOffToHuman,
} from "@/lib/session";

// Хариу өгөх 24-цагийн хязгаарт орохгүйн тулд Node.js runtime ашиглана
export const runtime = "nodejs";

// ──────────────────────────────────────────────────────────────────
// GET — Webhook баталгаажуулалт
// ──────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.FB_VERIFY_TOKEN) {
    console.log("[webhook] Verified ✅");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("[webhook] Verification failed");
  return new NextResponse("Forbidden", { status: 403 });
}

// ──────────────────────────────────────────────────────────────────
// POST — Ирж буй мессеж
// ──────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // Body-г түүхий хэлбэрээр унших (signature шалгахад хэрэгтэй)
  const rawBody = await request.text();

  // Facebook-аас ирсэн эсэхийг шалгах
  if (!verifySignature(request, rawBody)) {
    console.warn("[webhook] Invalid signature");
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const body = JSON.parse(rawBody);

  // Facebook нэн даруй 200 хариу хүлээдэг. Удаашрах боломжгүй.
  // Тиймээс мессеж боловсруулалтыг асинхрон байдлаар явуулна.
  if (body.object === "page") {
    // Удахгүй харуулах ёсгүй — заавал async/нэн даруй буцаах
    processEntriesAsync(body.entries).catch((err) =>
      console.error("[webhook] Error processing entries:", err)
    );
    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  }

  return new NextResponse("Not found", { status: 404 });
}

// ──────────────────────────────────────────────────────────────────
// Тусгай функцууд
// ──────────────────────────────────────────────────────────────────

interface FbEntry {
  id: string;
  time: number;
  messaging: FbMessagingEvent[];
}

interface FbMessagingEvent {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    is_echo?: boolean; // page-ээс ирсэн мессеж (өөрсдийнхөө хариу)
    quick_reply?: { payload: string };
  };
  postback?: {
    title: string;
    payload: string;
  };
}

async function processEntriesAsync(entries: FbEntry[]) {
  for (const entry of entries) {
    for (const event of entry.messaging || []) {
      await processMessagingEvent(event);
    }
  }
}

async function processMessagingEvent(event: FbMessagingEvent) {
  // Бидний өөрсдийн илгээсэн мессежийг үл тоомсорло
  if (event.message?.is_echo) return;

  const userId = event.sender.id;
  const text = event.message?.text || event.postback?.title;

  if (!text) {
    console.log("[webhook] No text, skipping");
    return;
  }

  console.log(`[msg] ${userId}: ${text}`);

  // 1. Мессеж "уншсан" гэж тэмдэглэх (хэрэглэгчдэд илүү харагдахуйц)
  await markMessageAsSeen(userId);

  // 2. Хүн рүү шилжүүлсэн чат бол AI хариулахгүй
  if (await isHandedOffToHuman(userId)) {
    console.log(`[msg] ${userId} нь хүн дээр шилжсэн — AI хариулахгүй`);
    return;
  }

  // 3. Шилжүүлэх keyword шалгах
  const lowerText = text.toLowerCase();
  if (
    lowerText.includes("оператор") ||
    lowerText.includes("ажилтан") ||
    lowerText.includes("хүн рүү") ||
    lowerText.includes("human") ||
    lowerText.includes("operator")
  ) {
    await markHandedOffToHuman(userId);
    await sendTextMessage(
      userId,
      "Танд манай ажилтан удахгүй холбогдоно ⏱️\n" +
        "Дундаж хүлээх хугацаа: 5-15 минут (09:00-18:00)"
    );
    return;
  }

  // 4. Бичиж байна гэсэн индикатор асаах
  await sendTypingIndicator(userId, true);

  try {
    // 5. Хэрэглэгчийн мессежийг session-д хадгалах
    await appendUserMessage(userId, text);

    // 6. Claude-аас хариулт авах
    const session = await getSession(userId);
    const reply = await generateReply(session.messages);

    // 7. Хариултыг хадгалах + Facebook-руу буцаах
    await appendAssistantMessage(userId, reply);
    await sendTextMessage(userId, reply);
  } catch (error) {
    console.error("[msg] AI хариу өгөхөд алдаа:", error);
    await sendTextMessage(
      userId,
      "Уучлаарай, түр зуурын алдаа гарлаа 😔\n" +
        'Дахин асууж үзнэ үү, эсвэл "оператор" гэж бичээд хүн дээр шилжих боломжтой.'
    );
  } finally {
    await sendTypingIndicator(userId, false);
  }
}

/**
 * Facebook signature шалгах.
 * Facebook X-Hub-Signature-256 header илгээдэг.
 * Энэ нь HMAC-SHA256(body, app_secret) утга.
 */
function verifySignature(request: NextRequest, rawBody: string): boolean {
  const signature = request.headers.get("x-hub-signature-256");
  if (!signature) return false;

  const appSecret = process.env.FB_APP_SECRET;
  if (!appSecret) {
    console.error("[webhook] FB_APP_SECRET тохиргоо алга");
    return false;
  }

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");

  // Constant-time compare
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

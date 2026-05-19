/**
 * Facebook Graph API клиент
 *
 * Solar Ease page-ийн нэрээр хэрэглэгч рүү мессеж буцаах,
 * "уншсан" тэмдэг, "бичиж байна" индикатор удирдана.
 */

const FB_API_BASE = "https://graph.facebook.com/v21.0";

/**
 * Хэрэглэгч рүү текст мессеж илгээх.
 *
 * Facebook 24 цагийн дүрэм: хэрэглэгч сүүлд бичсэнээс хойш 24 цагийн
 * дотор л free-form хариу илгээж болно. Бид webhook-оос хариулж байгаа
 * учраас үргэлж 24-цагийн дотор байх.
 */
export async function sendTextMessage(
  recipientId: string,
  text: string
): Promise<void> {
  // Facebook нэг мессежэнд 2000 тэмдэгт хүртэл зөвшөөрнө
  // Хэт урт бол хэсэгчилж явуулна
  const chunks = splitText(text, 1900);

  for (const chunk of chunks) {
    await fbRequest("/me/messages", {
      recipient: { id: recipientId },
      message: { text: chunk },
      messaging_type: "RESPONSE",
    });
  }
}

/**
 * "Бичиж байна..." индикатор асаах/унтраах
 */
export async function sendTypingIndicator(
  recipientId: string,
  on: boolean
): Promise<void> {
  await fbRequest("/me/messages", {
    recipient: { id: recipientId },
    sender_action: on ? "typing_on" : "typing_off",
  });
}

/**
 * Хэрэглэгчийн мессежийг "уншсан" гэж тэмдэглэх
 */
export async function markMessageAsSeen(recipientId: string): Promise<void> {
  await fbRequest("/me/messages", {
    recipient: { id: recipientId },
    sender_action: "mark_seen",
  });
}

// ──────────────────────────────────────────────────────────────────
// Тусгай функцууд
// ──────────────────────────────────────────────────────────────────

async function fbRequest(
  path: string,
  body: Record<string, unknown>
): Promise<void> {
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!token) {
    throw new Error("FB_PAGE_ACCESS_TOKEN тохиргоо алга");
  }

  const url = `${FB_API_BASE}${path}?access_token=${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[fb] API алдаа (${response.status}):`, errorText);
    throw new Error(`Facebook API алдаа: ${response.status}`);
  }
}

/**
 * Урт текстийг өгүүлбэрийн төгсгөлд таслан хэсэгчилнэ.
 */
function splitText(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLen) {
    // Хамгийн ойрын мөр шилжүүлэх / цэгийн дараа таслах
    let cutPoint = remaining.lastIndexOf("\n", maxLen);
    if (cutPoint < maxLen / 2) cutPoint = remaining.lastIndexOf(". ", maxLen);
    if (cutPoint < maxLen / 2) cutPoint = maxLen;

    chunks.push(remaining.slice(0, cutPoint).trim());
    remaining = remaining.slice(cutPoint).trim();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

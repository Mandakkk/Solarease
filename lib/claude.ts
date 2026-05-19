/**
 * Claude API клиент
 *
 * Anthropic SDK ашиглан танай FAQ-ээс суралцсан хариулт үүсгэнэ.
 */

import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./knowledge";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Хариулт үүсгэх.
 *
 * @param messages — Сүүлийн N мессежийн түүх (хэрэглэгч + AI)
 * @returns Claude-ийн монгол хэлээрх хариулт
 */
export async function generateReply(messages: ChatMessage[]): Promise<string> {
  // Хариулт хэт богино, мөн хэт урт байхгүйн тулд max_tokens багц
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 600, // ~3-6 өгүүлбэрт хангалттай
    system: SYSTEM_PROMPT,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  // Хариултыг текст байдлаар гаргах
  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  if (!text) {
    return "Уучлаарай, ойлгосонгүй. Өөрөөр асууж үзнэ үү?";
  }

  return text;
}

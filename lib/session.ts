/**
 * Харилцагчийн чатын түүхийг хадгалах модул.
 *
 * Энэ нь "санах ой" — AI хариулахын тулд өмнөх мессежүүдээ мэдэх ёстой.
 *
 * ЗАГВАР:
 *   - Хөгжүүлэлтийн үед (local): In-memory Map ашиглана
 *   - Production (Vercel) дээр: Postgres эсвэл KV ашиглах ёстой
 *
 * ⚠️ Vercel serverless function-ууд cold start болж байнга шинээр асна.
 *    In-memory дата хадгалагдахгүй. Production-д заавал DB хэрэглэ.
 *
 * Доор хоёр хувилбар өгсөн:
 *   1) InMemoryStore — туршилт, локал хөгжүүлэлтэд
 *   2) PostgresStore — production-д (танай SolarEase DB-тэй адил DB)
 *
 * Switch хийхийн тулд доорх `store` хувьсагчийг солино.
 */

import type { ChatMessage } from "./claude";

export interface Session {
  userId: string;
  messages: ChatMessage[];
  handedOff: boolean; // хүн дээр шилжсэн эсэх
  updatedAt: Date;
}

// Сүүлийн N мессежийг л санах (контекст хязгаарлах)
const MAX_MESSAGES = 12;

interface SessionStore {
  getSession(userId: string): Promise<Session>;
  appendUserMessage(userId: string, text: string): Promise<void>;
  appendAssistantMessage(userId: string, text: string): Promise<void>;
  isHandedOffToHuman(userId: string): Promise<boolean>;
  markHandedOffToHuman(userId: string): Promise<void>;
}

// ──────────────────────────────────────────────────────────────────
// IN-MEMORY (туршилтад л зориулсан)
// ──────────────────────────────────────────────────────────────────

class InMemoryStore implements SessionStore {
  private sessions = new Map<string, Session>();

  async getSession(userId: string): Promise<Session> {
    let session = this.sessions.get(userId);
    if (!session) {
      session = {
        userId,
        messages: [],
        handedOff: false,
        updatedAt: new Date(),
      };
      this.sessions.set(userId, session);
    }
    return session;
  }

  async appendUserMessage(userId: string, text: string): Promise<void> {
    const session = await this.getSession(userId);
    session.messages.push({ role: "user", content: text });
    this.trimMessages(session);
    session.updatedAt = new Date();
  }

  async appendAssistantMessage(userId: string, text: string): Promise<void> {
    const session = await this.getSession(userId);
    session.messages.push({ role: "assistant", content: text });
    this.trimMessages(session);
    session.updatedAt = new Date();
  }

  async isHandedOffToHuman(userId: string): Promise<boolean> {
    const session = await this.getSession(userId);
    // 24 цаг өнгөрсний дараа AI дахин асна
    const hoursSince =
      (Date.now() - session.updatedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSince > 24) {
      session.handedOff = false;
    }
    return session.handedOff;
  }

  async markHandedOffToHuman(userId: string): Promise<void> {
    const session = await this.getSession(userId);
    session.handedOff = true;
    session.updatedAt = new Date();
  }

  private trimMessages(session: Session) {
    if (session.messages.length > MAX_MESSAGES) {
      session.messages = session.messages.slice(-MAX_MESSAGES);
    }
  }
}

// ──────────────────────────────────────────────────────────────────
// POSTGRES (production-д зориулсан)
// ──────────────────────────────────────────────────────────────────
//
// Vercel Postgres эсвэл аливаа Postgres-тэй ажиллана.
// Дараах хүснэгтийг үүсгэх ёстой:
//
// CREATE TABLE messenger_sessions (
//   user_id      TEXT PRIMARY KEY,
//   messages     JSONB NOT NULL DEFAULT '[]',
//   handed_off   BOOLEAN NOT NULL DEFAULT FALSE,
//   updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );
//
// `@vercel/postgres` суулгасан байх ёстой:
//   npm install @vercel/postgres
//
// Дараа нь доорх кодыг идэвхжүүлж, доод хэсгийн `store`-ыг шинэчилнэ.

/*
import { sql } from "@vercel/postgres";

class PostgresStore implements SessionStore {
  async getSession(userId: string): Promise<Session> {
    const { rows } = await sql`
      SELECT user_id, messages, handed_off, updated_at
      FROM messenger_sessions
      WHERE user_id = ${userId}
    `;

    if (rows.length === 0) {
      await sql`
        INSERT INTO messenger_sessions (user_id, messages, handed_off)
        VALUES (${userId}, '[]'::jsonb, FALSE)
      `;
      return {
        userId,
        messages: [],
        handedOff: false,
        updatedAt: new Date(),
      };
    }

    const row = rows[0];
    return {
      userId: row.user_id,
      messages: row.messages as ChatMessage[],
      handedOff: row.handed_off,
      updatedAt: new Date(row.updated_at),
    };
  }

  async appendUserMessage(userId: string, text: string): Promise<void> {
    const session = await this.getSession(userId);
    const updated = [...session.messages, { role: "user" as const, content: text }]
      .slice(-MAX_MESSAGES);
    await sql`
      UPDATE messenger_sessions
      SET messages = ${JSON.stringify(updated)}::jsonb, updated_at = NOW()
      WHERE user_id = ${userId}
    `;
  }

  async appendAssistantMessage(userId: string, text: string): Promise<void> {
    const session = await this.getSession(userId);
    const updated = [...session.messages, { role: "assistant" as const, content: text }]
      .slice(-MAX_MESSAGES);
    await sql`
      UPDATE messenger_sessions
      SET messages = ${JSON.stringify(updated)}::jsonb, updated_at = NOW()
      WHERE user_id = ${userId}
    `;
  }

  async isHandedOffToHuman(userId: string): Promise<boolean> {
    const { rows } = await sql`
      SELECT handed_off, updated_at FROM messenger_sessions
      WHERE user_id = ${userId}
    `;
    if (rows.length === 0) return false;
    const hoursSince = (Date.now() - new Date(rows[0].updated_at).getTime()) / (1000 * 60 * 60);
    return rows[0].handed_off && hoursSince <= 24;
  }

  async markHandedOffToHuman(userId: string): Promise<void> {
    await sql`
      INSERT INTO messenger_sessions (user_id, handed_off)
      VALUES (${userId}, TRUE)
      ON CONFLICT (user_id) DO UPDATE SET handed_off = TRUE, updated_at = NOW()
    `;
  }
}
*/

// ──────────────────────────────────────────────────────────────────
// ИДЭВХТЭЙ STORE-ЫГ ЭНД СОНГОНО
// ──────────────────────────────────────────────────────────────────

const store: SessionStore = new InMemoryStore();
// Production-д: const store: SessionStore = new PostgresStore();

// ──────────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────────

export const getSession = (userId: string) => store.getSession(userId);
export const appendUserMessage = (userId: string, text: string) =>
  store.appendUserMessage(userId, text);
export const appendAssistantMessage = (userId: string, text: string) =>
  store.appendAssistantMessage(userId, text);
export const isHandedOffToHuman = (userId: string) =>
  store.isHandedOffToHuman(userId);
export const markHandedOffToHuman = (userId: string) =>
  store.markHandedOffToHuman(userId);

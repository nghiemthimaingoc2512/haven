import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { REFLECT_SYSTEM } from "@/lib/ai/prompts";
import {
  MODEL,
  apiErrorResponse,
  badRequest,
  getClient,
  hasApiKey,
  isLang,
  noKeyResponse,
  sanitizeMessages,
} from "@/lib/ai/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const EMOTION_KEYS = [
  "happy",
  "calm",
  "peaceful",
  "neutral",
  "sad",
  "worried",
  "anxious",
  "frustrated",
  "angry",
  "overwhelmed",
  "hopeful",
  "inspired",
] as const;

const ReflectionSchema = z.object({
  reflection: z.string(),
  standout: z.string().nullable(),
  emotionKey: z.enum(EMOTION_KEYS),
  intensity: z.enum(["low", "medium", "high"]),
  confidence: z.number().min(0).max(1),
  topics: z.array(z.string()).max(3),
  people: z.array(z.string()).max(6),
});

export type ReflectionResult = z.infer<typeof ReflectionSchema>;

/** Turns a finished Whisper conversation into one saved memory (structured JSON). */
export async function POST(req: Request) {
  if (!hasApiKey()) return noKeyResponse();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }
  const { lang, messages } = (body ?? {}) as Record<string, unknown>;
  if (!isLang(lang)) return badRequest();
  const history = sanitizeMessages(messages);
  if (!history) return badRequest();

  const transcript = history
    .map((m) => `${m.role === "user" ? (lang === "vi" ? "Người dùng" : "User") : lang === "vi" ? "Thì Thầm" : "Whisper"}: ${m.content}`)
    .join("\n");

  try {
    const response = await getClient().messages.parse({
      model: MODEL,
      max_tokens: 2048,
      system: [{ type: "text", text: REFLECT_SYSTEM[lang], cache_control: { type: "ephemeral" } }],
      output_config: { effort: "medium", format: zodOutputFormat(ReflectionSchema) },
      messages: [{ role: "user", content: transcript }],
    });
    if (!response.parsed_output) {
      return Response.json({ error: "unparsed" }, { status: 502 });
    }
    return Response.json(response.parsed_output, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return apiErrorResponse(err);
  }
}

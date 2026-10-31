import { WHISPER_SYSTEM } from "@/lib/ai/prompts";
import {
  MODEL,
  apiErrorResponse,
  badRequest,
  buildSystem,
  getClient,
  hasApiKey,
  isLang,
  noKeyResponse,
  sanitizeContext,
  sanitizeMessages,
  textStreamResponse,
} from "@/lib/ai/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/** One Whisper turn, streamed back as plain text. */
export async function POST(req: Request) {
  if (!hasApiKey()) return noKeyResponse();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }
  const { lang, messages, context } = (body ?? {}) as Record<string, unknown>;
  if (!isLang(lang)) return badRequest();
  const history = sanitizeMessages(messages);
  if (!history) return badRequest();

  try {
    const stream = getClient().messages.stream({
      model: MODEL,
      max_tokens: 1024, // replies are deliberately short (2-4 sentences)
      system: buildSystem(WHISPER_SYSTEM[lang], lang, sanitizeContext(context)),
      output_config: { effort: "low" },
      messages: history,
    });
    return textStreamResponse(stream);
  } catch (err) {
    return apiErrorResponse(err);
  }
}

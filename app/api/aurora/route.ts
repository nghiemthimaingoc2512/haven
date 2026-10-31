import type Anthropic from "@anthropic-ai/sdk";
import { AURORA_SUMMARY_INSTRUCTION, AURORA_SYSTEM } from "@/lib/ai/prompts";
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

/**
 * One Aurora turn, streamed as plain text. `mode: "summarize"` asks for the
 * closing three-part summary instead of another question.
 */
export async function POST(req: Request) {
  if (!hasApiKey()) return noKeyResponse();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }
  const { lang, messages, context, mode } = (body ?? {}) as Record<string, unknown>;
  if (!isLang(lang)) return badRequest();
  const history = sanitizeMessages(messages);
  if (!history) return badRequest();

  const summarize = mode === "summarize";
  const finalMessages: Anthropic.MessageParam[] = summarize
    ? [...history, { role: "user", content: AURORA_SUMMARY_INSTRUCTION[lang] }]
    : history;

  try {
    const stream = getClient().messages.stream({
      model: MODEL,
      max_tokens: summarize ? 1024 : 1024, // short coaching turns by design
      system: buildSystem(AURORA_SYSTEM[lang], lang, sanitizeContext(context)),
      output_config: { effort: summarize ? "medium" : "low" },
      messages: finalMessages,
    });
    return textStreamResponse(stream);
  } catch (err) {
    return apiErrorResponse(err);
  }
}

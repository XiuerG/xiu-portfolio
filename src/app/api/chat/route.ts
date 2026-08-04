import { NextRequest } from "next/server";
import { answerFromKnowledge } from "@/lib/answer";
import { buildSystemPrompt, surfaceableSlugs } from "@/lib/profile";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * Streaming protocol (one JSON object per line / NDJSON):
 *   {"type":"text","value":"..."}   incremental answer text
 *   {"type":"card","slug":"..."}    surface a project preview card (§6.2)
 *   {"type":"error"}                recoverable error; client shows warm copy
 *
 * Same protocol whether the answer comes from Claude (when ANTHROPIC_API_KEY is
 * set) or the keyless fallback engine — so the client never branches on source.
 */

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
const MAX_TURNS = 8;

function ndjson(obj: unknown): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(obj) + "\n");
}

/** Streams text word-by-word (typewriter feel) then any card events. */
function streamFallback(text: string, slugs: string[]): Response {
  const words = text.split(/(\s+)/);
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const w of words) {
        controller.enqueue(ndjson({ type: "text", value: w }));
        if (w.trim()) await new Promise((r) => setTimeout(r, 16));
      }
      // Cards follow the words, a beat later (the "slow half-step" of §6.2).
      for (const slug of slugs.slice(0, 2)) {
        await new Promise((r) => setTimeout(r, 260));
        controller.enqueue(ndjson({ type: "card", slug }));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

const surfaceTool = {
  name: "surface_project",
  description:
    "When an existing project is highly relevant to the user's question, call this to show its preview card. Answer in words first; call at most twice per reply.",
  input_schema: {
    type: "object",
    properties: {
      slug: { type: "string", enum: surfaceableSlugs },
    },
    required: ["slug"],
  },
} as const;

/**
 * Non-streaming Claude call, then re-stream the result through our protocol.
 * Keeping the upstream call non-streaming makes tool-use parsing reliable; the
 * typewriter effect is reproduced client-side from the streamed words.
 */
async function answerWithClaude(
  apiKey: string,
  messages: ChatMessage[],
): Promise<Response> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      temperature: 0.5,
      system: buildSystemPrompt(),
      tools: [surfaceTool],
      messages: messages.slice(-MAX_TURNS).map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!res.ok) throw new Error(`Anthropic request failed: ${res.status}`);

  const data = await res.json();
  const blocks: Array<{ type: string; text?: string; name?: string; input?: { slug?: string } }> =
    data?.content ?? [];

  let text = "";
  const slugs: string[] = [];
  for (const b of blocks) {
    if (b.type === "text" && b.text) text += b.text;
    if (b.type === "tool_use" && b.name === "surface_project" && b.input?.slug) {
      if (surfaceableSlugs.includes(b.input.slug)) slugs.push(b.input.slug);
    }
  }
  if (!text.trim()) text = "Mm — let me point you to Xiuer directly; the Contact page has her email.";

  return streamFallback(text, slugs.slice(0, 2));
}

export async function POST(req: NextRequest) {
  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages)
      ? body.messages.filter(
          (m: ChatMessage) => m?.role && typeof m?.content === "string",
        )
      : [];
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const question = lastUser?.content ?? "";

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      return await answerWithClaude(apiKey, messages);
    } catch {
      // Graceful degradation to the keyless engine (§7.3 error handling).
      const a = answerFromKnowledge(question);
      return streamFallback(a.text, a.slugs);
    }
  }

  const a = answerFromKnowledge(question);
  return streamFallback(a.text, a.slugs);
}

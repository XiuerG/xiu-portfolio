import { bio, stances, tone, type Stance } from "./profile";
import { projects } from "./projects";

/**
 * Keyless fallback engine (DESIGN_SPEC §7.2 "simpler退路").
 *
 * Runs when there is no ANTHROPIC_API_KEY. It maps intent to a written stance
 * and, when a specific project is highly relevant, surfaces up to TWO preview
 * cards by slug. It deliberately does NOT re-list the work (§11 Don't #1) and
 * never invents project copy (§11 Don't #2).
 *
 * Returns the answer text plus the slugs of any cards to surface.
 */

export type Answer = { text: string; slugs: string[] };

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "be",
  "been", "being", "to", "of", "in", "on", "for", "with", "about", "at", "by",
  "from", "as", "it", "its", "this", "that", "these", "those", "do", "does",
  "did", "can", "could", "would", "should", "will", "what", "whats", "how",
  "why", "when", "where", "who", "which", "you", "your", "yours", "me", "my",
  "i", "tell", "show", "give", "please", "her", "she", "he", "his", "them",
  "they", "have", "has", "had", "get", "got", "any", "some", "more", "most",
  "like", "want", "know", "think", "really", "just", "much", "very", "lot",
  "there", "here", "thing", "things", "kind", "sort", "also",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function scoreStance(tokens: string[], stance: Stance): number {
  const tagSet = new Set(stance.tags.map((t) => t.toLowerCase()));
  const contentTokens = new Set(tokenize(stance.content));
  let score = 0;
  for (const tok of tokens) {
    if (tagSet.has(tok)) score += 3;
    if (contentTokens.has(tok)) score += 1;
  }
  return score;
}

/**
 * Match a project by its *distinctive* name only (title + slug words), so a
 * generic word like "design" in a project's role can't trigger a card. This
 * fires for "tell me about Moritz Center", not for "design or code?".
 */
const GENERIC_NAME_WORDS = new Set(["design", "interaction", "concept", "redesign"]);

function matchProjectSlug(tokens: string[]): string | null {
  let bestSlug: string | null = null;
  let bestScore = 0;
  for (const p of projects) {
    const hay = new Set(
      [...tokenize(p.title), ...tokenize(p.slug.replace(/-/g, " "))].filter(
        (w) => !GENERIC_NAME_WORDS.has(w),
      ),
    );
    let s = 0;
    for (const tok of tokens) if (hay.has(tok)) s += 2;
    if (s > bestScore) {
      bestScore = s;
      bestSlug = p.slug;
    }
  }
  return bestScore >= 2 ? bestSlug : null;
}

const GREETING_RE = /^(hi|hey|hello|yo|sup|howdy|greetings|hiya|mm+)\b/i;
const THANKS_RE = /\b(thanks|thank you|thx|appreciate)\b/i;
/** "Just show me everything" — the cat should defer, not re-list (§4, §11). */
const LIST_ALL_RE =
  /\b(show me (all )?(your |her )?work|list (your |her )?(work|projects?)|see (all )?(the )?work|what (work|projects?) (do you|does she) have|portfolio|everything)\b/i;

export function answerFromKnowledge(question: string): Answer {
  const q = question.trim();
  if (!q) return { text: tone.fallback, slugs: [] };

  const tokens = tokenize(q);

  if (GREETING_RE.test(q) && tokens.length <= 2) {
    return {
      text: "Mm, hi. Ask me how Xiuer's work connects, where she leans, or whether she'd fit — the stuff a plain list won't tell you.",
      slugs: [],
    };
  }
  if (THANKS_RE.test(q)) {
    return { text: "Anytime. I'll be right here.", slugs: [] };
  }

  // Defer "show me everything" to the page rather than re-listing it.
  const projectSlug = matchProjectSlug(tokens);
  if (LIST_ALL_RE.test(q) && !projectSlug) {
    return {
      text: "It's all in the list on the page — have a wander. If you tell me what you're actually after (a leaning, a domain, a fit), I can point you to the right one.",
      slugs: [],
    };
  }

  // Best cross-cutting stance.
  let bestStance: Stance | null = null;
  let bestScore = 0;
  for (const s of stances) {
    const sc = scoreStance(tokens, s);
    if (sc > bestScore) {
      bestScore = sc;
      bestStance = s;
    }
  }

  // A specific project was clearly named → connect + surface that one card.
  if (projectSlug) {
    const p = projects.find((x) => x.slug === projectSlug)!;
    // If a stance also fits well, lead with judgement; else a light connector.
    const lead =
      bestStance && bestScore >= 4
        ? bestStance.content
        : `Good one to look at — here's ${p.title}.`;
    const slugs = bestStance?.relatedSlugs?.length
      ? Array.from(new Set([projectSlug, ...bestStance.relatedSlugs])).slice(0, 2)
      : [projectSlug];
    return { text: lead, slugs };
  }

  // Cross-cutting stance with real signal → answer + optional supporting cards.
  if (bestStance && bestScore >= 3) {
    return {
      text: bestStance.content,
      slugs: (bestStance.relatedSlugs ?? []).slice(0, 2),
    };
  }

  // Weak signal but clearly about Xiuer → bio, no cards.
  if (/\bxiuer\b/i.test(q)) {
    return { text: bio, slugs: [] };
  }

  // Warm fallback (§5.7).
  return { text: tone.fallback, slugs: [] };
}

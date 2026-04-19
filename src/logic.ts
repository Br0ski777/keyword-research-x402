import type { Hono } from "hono";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

// --------------- Cache ---------------
interface CacheEntry {
  data: any;
  timestamp: number;
}

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const cache = new Map<string, CacheEntry>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// --------------- Intent classification ---------------
const TRANSACTIONAL_PATTERNS = [
  /\b(buy|price|cost|cheap|deal|discount|coupon|order|purchase|subscription|plan|pricing|hire|book)\b/i,
  /\b(best|top|review|vs|compare|alternative)\b/i,
];

const INFORMATIONAL_PATTERNS = [
  /\b(how|what|why|when|where|who|which|guide|tutorial|learn|explain|definition|meaning)\b/i,
  /\b(tips|examples|ideas|ways|steps|process)\b/i,
];

const NAVIGATIONAL_PATTERNS = [
  /\b(login|sign in|website|official|app|download|contact|support)\b/i,
];

function classifyIntent(keyword: string): "transactional" | "informational" | "navigational" | "mixed" {
  const transScore = TRANSACTIONAL_PATTERNS.reduce((s, p) => s + (p.test(keyword) ? 1 : 0), 0);
  const infoScore = INFORMATIONAL_PATTERNS.reduce((s, p) => s + (p.test(keyword) ? 1 : 0), 0);
  const navScore = NAVIGATIONAL_PATTERNS.reduce((s, p) => s + (p.test(keyword) ? 1 : 0), 0);

  const max = Math.max(transScore, infoScore, navScore);
  if (max === 0) return "informational";
  if (transScore === max && transScore > infoScore) return "transactional";
  if (infoScore === max && infoScore > transScore) return "informational";
  if (navScore === max) return "navigational";
  return "mixed";
}

// --------------- Google Suggest ---------------

async function fetchSuggestions(query: string): Promise<string[]> {
  const encoded = encodeURIComponent(query);
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encoded}`;

  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    if (!resp.ok) return [];
    const data: any = await resp.json();
    // Response format: [query, [suggestions]]
    return Array.isArray(data[1]) ? data[1] : [];
  } catch {
    return [];
  }
}

// --------------- Main logic ---------------

const MODIFIERS = ["vs", "for", "how to", "best", "what is"];

async function researchKeywords(query: string): Promise<{
  primaryKeyword: string;
  suggestions: string[];
  relatedQueries: Record<string, string[]>;
  longTailKeywords: string[];
  searchIntent: string;
  intentBreakdown: Record<string, string>;
  totalKeywords: number;
}> {
  const cacheKey = `kw_${query.toLowerCase().trim()}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  // Fetch primary suggestions
  const primarySuggestions = await fetchSuggestions(query);

  // Fetch related suggestions with modifiers (parallel)
  const relatedPromises = MODIFIERS.map(async (mod) => {
    const modQuery = `${query} ${mod}`;
    const suggestions = await fetchSuggestions(modQuery);
    return { modifier: mod, suggestions };
  });

  const relatedResults = await Promise.all(relatedPromises);

  // Build related queries map
  const relatedQueries: Record<string, string[]> = {};
  for (const { modifier, suggestions } of relatedResults) {
    if (suggestions.length > 0) {
      relatedQueries[modifier] = suggestions.slice(0, 8);
    }
  }

  // Extract long-tail keywords (4+ words)
  const allSuggestions = [
    ...primarySuggestions,
    ...Object.values(relatedQueries).flat(),
  ];
  const longTailKeywords = [...new Set(
    allSuggestions.filter((s) => s.split(" ").length >= 4)
  )].slice(0, 20);

  // Classify intent for all keywords
  const intentBreakdown: Record<string, string> = {};
  for (const kw of primarySuggestions.slice(0, 10)) {
    intentBreakdown[kw] = classifyIntent(kw);
  }

  const result = {
    primaryKeyword: query,
    suggestions: primarySuggestions.slice(0, 10),
    relatedQueries,
    longTailKeywords,
    searchIntent: classifyIntent(query),
    intentBreakdown,
    totalKeywords: allSuggestions.length,
  };

  setCache(cacheKey, result);
  return result;
}

// --------------- Routes ---------------

export function registerRoutes(app: Hono) {
  app.get("/api/keywords", async (c) => {
    await tryRequirePayment(0.01);
    const query = c.req.query("query");

    if (!query || query.trim().length === 0) {
      return c.json({
        error: "Missing required parameter 'query'",
        example: "/api/keywords?query=bitcoin+trading",
      }, 400);
    }

    try {
      const result = await researchKeywords(query.trim());
      return c.json({
        ...result,
        cachedFor: "30m",
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return c.json({ error: "Keyword research failed", details: err.message }, 502);
    }
  });
}

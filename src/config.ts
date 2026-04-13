import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "keyword-research",
  slug: "keyword-research",
  description: "SEO keyword research -- Google Suggest, intent classification, long-tail discovery, related queries. Content planning.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/keywords",
      price: "$0.01",
      description: "Research keywords with Google autocomplete suggestions, related queries, and intent classification",
      toolName: "seo_research_keywords",
      toolDescription:
        `Use this when you need keyword ideas, SEO research, or content planning data for a topic. Returns keyword suggestions and intent data in JSON.

Returns: 1. suggestions array (Google autocomplete) 2. relatedQueries with modifiers (vs, for, how to, best, what is) 3. longTailKeywords array 4. searchIntent classification (informational/transactional/navigational/commercial) 5. totalKeywords count.

Example output: {"query":"bitcoin trading","suggestions":["bitcoin trading platform","bitcoin trading bot","bitcoin trading for beginners"],"relatedQueries":{"vs":["bitcoin trading vs investing"],"howTo":["how to start bitcoin trading"]},"longTailKeywords":["best bitcoin trading app 2026","bitcoin trading strategy for beginners"],"searchIntent":"commercial","totalKeywords":47}

Use this BEFORE writing blog posts, FOR SEO content strategy, topic cluster planning, content gap analysis, and competitive keyword research.

Do NOT use for page SEO audit -- use seo_audit_page instead. Do NOT use for content extraction -- use web_scrape_to_markdown instead. Do NOT use for domain intelligence -- use domain_lookup_intelligence instead.`,
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The seed keyword or phrase to research (e.g. 'bitcoin trading', 'best crm software')",
          },
        },
        required: ["query"],
      },
    },
  ],
};

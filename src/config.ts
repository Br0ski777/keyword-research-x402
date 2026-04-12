import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "keyword-research",
  slug: "keyword-research",
  description: "SEO keyword research via Google Suggest with intent scoring and long-tail discovery.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/keywords",
      price: "$0.01",
      description: "Research keywords with Google autocomplete suggestions, related queries, and intent classification",
      toolName: "seo_research_keywords",
      toolDescription:
        "Use this when you need keyword ideas, SEO research, or content planning data for a topic. Returns Google autocomplete suggestions, related queries (vs, for, how to, best, what is modifiers), long-tail keywords, and search intent classification (informational/transactional/navigational). Ideal for SEO strategy, blog topic research, and content gap analysis. Do NOT use for page SEO — use seo_audit_page. Do NOT use for content extraction — use web_scrape_to_markdown.",
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

# Keyword Research API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://keyword-research.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

SEO keyword research -- Google Suggest, intent classification, long-tail discovery, related queries. Content planning. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "keyword-research": {
      "url": "https://keyword-research.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl "https://keyword-research.api.klymax402.com/api/keywords?query=..."
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `seo_research_keywords` | GET | `/api/keywords` | $0.02 | Research keywords with Google autocomplete suggestions, related queries, and intent classification |
| `seo_research_keywords` | POST | `/api/keywords` | $0.02 | Research keywords with Google autocomplete suggestions, related queries, and intent classification (POST variant) |

### `seo_research_keywords`

Use this when you need keyword ideas, SEO research, or content planning data for a topic. Returns keyword suggestions and intent data in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | The seed keyword or phrase to research (e.g. 'bitcoin trading', 'best crm software') |

Example response:

```json
{"query":"bitcoin trading","suggestions":["bitcoin trading platform","bitcoin trading bot","bitcoin trading for beginners"],"relatedQueries":{"vs":["bitcoin trading vs investing"],"howTo":["how to start bitcoin trading"]},"longTailKeywords":["best bitcoin trading app 2026","bitcoin trading strategy for beginners"],"searchIntent":"commercial","totalKeywords":47}
```

**When to use**: writing blog posts, FOR SEO content strategy, topic cluster planning, content gap analysis, and competitive keyword research.

**Not for**: page SEO audit (use `seo_audit_page`), content extraction (use `web_scrape_to_markdown`), domain intelligence (use `domain_lookup_intelligence`).

### `seo_research_keywords`

Use this when you need keyword ideas, SEO research, or content planning data for a topic. Returns keyword suggestions and intent data in JSON. POST variant of seo_research_keywords -- same params passed as JSON body instead of query string.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | The seed keyword or phrase to research (e.g. 'bitcoin trading', 'best crm software') |

Example response:

```json
{"query":"bitcoin trading","suggestions":["bitcoin trading platform","bitcoin trading bot","bitcoin trading for beginners"],"relatedQueries":{"vs":["bitcoin trading vs investing"],"howTo":["how to start bitcoin trading"]},"longTailKeywords":["best bitcoin trading app 2026","bitcoin trading strategy for beginners"],"searchIntent":"commercial","totalKeywords":47}
```

**When to use**: writing blog posts, FOR SEO content strategy, topic cluster planning, content gap analysis, and competitive keyword research.

**Not for**: page SEO audit (use `seo_audit_page`), content extraction (use `web_scrape_to_markdown`), domain intelligence (use `domain_lookup_intelligence`).

## Example agent prompts

- "Keyword ideas, SEO research, or content planning data for a topic"
- "Keyword ideas, SEO research, or content planning data for a topic"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT

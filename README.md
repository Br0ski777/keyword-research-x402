# Keyword Research API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://keyword-research.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

SEO keyword research via Google Suggest with intent scoring and long-tail discovery. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

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
| `seo_research_keywords` | GET | `/api/keywords` | $0.01 | Research keywords with Google autocomplete suggestions, related queries, and intent classification |

### `seo_research_keywords`

Use this when you need keyword ideas, SEO research, or content planning data for a topic. Returns Google autocomplete suggestions, related queries (vs, for, how to, best, what is modifiers), long-tail keywords, and search intent classification (informational/transactional/navigational). Ideal for SEO strategy, blog topic research, and content gap analysis. Do NOT use for page SEO — use seo_audit_page. Do NOT use for content extraction — use web_scrape_to_markdown.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | The seed keyword or phrase to research (e.g. 'bitcoin trading', 'best crm software') |

## Example agent prompts

- "Keyword ideas, SEO research, or content planning data for a topic"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT

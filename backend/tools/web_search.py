import requests
from config import SERPAPI_KEY


def web_search(query: str) -> str:
    """Search the web using SerpAPI and return top snippets."""
    if not SERPAPI_KEY or SERPAPI_KEY == "your-serpapi-key-here":
        return f"[Mock search result for: {query}] Web search not configured. Add SERPAPI_KEY to .env"

    url = "https://serpapi.com/search"
    params = {
        "q":       query,
        "api_key": SERPAPI_KEY,
        "num":     3,
        "hl":      "en",
        "gl":      "us",
    }
    try:
        resp = requests.get(url, params=params, timeout=10)
        data = resp.json()
        snippets = [
            r.get("snippet", "")
            for r in data.get("organic_results", [])[:3]
            if r.get("snippet")
        ]
        return " | ".join(snippets) if snippets else "No results found."
    except Exception as e:
        return f"Search error: {str(e)}"

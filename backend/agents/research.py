from tools.web_search import web_search


class ResearchAgent:
    """Searches the web for information relevant to each plan step."""

    def research(self, plan: list[str]) -> str:
        results = []
        # Research only top 3 steps to stay within API limits
        for step in plan[:3]:
            data = web_search(step)
            results.append(f"📌 Step: {step}\n🔍 Data: {data}")
        return "\n\n".join(results) if results else "No research data available."

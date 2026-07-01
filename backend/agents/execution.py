from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)


class ExecutionAgent:
    """Synthesizes plan + research into a comprehensive answer."""

    def execute(self, plan: list[str], research: str, context: str = "") -> str:
        plan_text = "\n".join(plan)
        context_section = f"Memory context:\n{context}\n\n" if context else ""

        prompt = f"""{context_section}You are an expert AI assistant.
Using the plan and research data below, write a comprehensive, well-structured answer.
Be factual, clear, and helpful.

Plan:
{plan_text}

Research Data:
{research}

Write a complete answer to the original task based on the above."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
        )
        return response.choices[0].message.content.strip()

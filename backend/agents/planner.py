from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)


class PlannerAgent:
    """Breaks a user task into clear, actionable sub-steps."""

    def plan(self, task: str, context: str = "") -> list[str]:
        context_section = f"Relevant past context:\n{context}\n\n" if context else ""
        prompt = f"""{context_section}You are an expert planning AI.
Break the following task into a clear numbered list of concrete steps.
Each step should be short, specific, and actionable.
Return ONLY the numbered list — no extra commentary.

Task: {task}"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        raw = response.choices[0].message.content.strip()
        steps = [
            line.strip()
            for line in raw.split("\n")
            if line.strip() and line.strip()[0].isdigit()
        ]
        return steps if steps else [raw]

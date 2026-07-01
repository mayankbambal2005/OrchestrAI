from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)


class CriticAgent:
    """Reviews the answer, identifies weaknesses, and returns an improved version."""

    def critique(self, answer: str, original_task: str) -> tuple[str, str]:
        prompt = f"""You are a critical AI reviewer.
Review the answer below for the given task. Check for:
- Accuracy and completeness
- Clarity and readability  
- Missing important points

Original task: {original_task}

Draft answer:
{answer}

Respond in this exact format:
EXPLANATION: <2-3 sentences explaining what you improved and why>
IMPROVED_ANSWER: <the full improved answer>"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
        )
        raw = response.choices[0].message.content.strip()

        explanation   = ""
        final_answer  = answer  # fallback to original

        if "EXPLANATION:" in raw and "IMPROVED_ANSWER:" in raw:
            parts = raw.split("IMPROVED_ANSWER:")
            explanation  = parts[0].replace("EXPLANATION:", "").strip()
            final_answer = parts[1].strip()

        return final_answer, explanation

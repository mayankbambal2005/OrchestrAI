from agents.planner import PlannerAgent
from agents.research import ResearchAgent
from agents.execution import ExecutionAgent
from agents.critic import CriticAgent
from agents.memory_agent import MemoryAgent


class Orchestrator:
    def __init__(self, websocket=None):
        self.ws         = websocket
        self.planner    = PlannerAgent()
        self.researcher = ResearchAgent()
        self.executor   = ExecutionAgent()
        self.critic     = CriticAgent()
        self.memory     = MemoryAgent()

    async def broadcast(self, agent_name: str, status: str, detail: str = ""):
        if self.ws:
            await self.ws.send_json({
                "agent":  agent_name,
                "status": status,
                "detail": detail
            })

    async def run(self, user_task: str) -> dict:
        steps_log = []

        # Step 1: Memory context
        await self.broadcast("Memory Agent", "active", "Fetching relevant past context...")
        context = self.memory.retrieve(user_task)
        steps_log.append({"agent": "Memory Agent", "detail": "Context retrieved"})

        # Step 2: Plan
        await self.broadcast("Planner Agent", "active", "Decomposing task into steps...")
        plan = self.planner.plan(user_task, context)
        steps_log.append({"agent": "Planner Agent", "detail": f"{len(plan)} steps created"})

        # Step 3: Research
        await self.broadcast("Research Agent", "active", "Gathering information from web...")
        research_data = self.researcher.research(plan)
        steps_log.append({"agent": "Research Agent", "detail": "Research complete"})

        # Step 4: Execute
        await self.broadcast("Execution Agent", "active", "Generating answer...")
        raw_answer = self.executor.execute(plan, research_data, context)
        steps_log.append({"agent": "Execution Agent", "detail": "Draft answer ready"})

        # Step 5: Critique
        await self.broadcast("Critic Agent", "active", "Reviewing and improving answer...")
        final_answer, explanation = self.critic.critique(raw_answer, user_task)
        steps_log.append({"agent": "Critic Agent", "detail": "Answer refined"})

        # Step 6: Store
        await self.broadcast("Memory Agent", "active", "Saving to memory...")
        self.memory.store(user_task, final_answer)
        steps_log.append({"agent": "Memory Agent", "detail": "Saved to memory"})

        await self.broadcast("Orchestrator", "done", "Task complete ✅")

        return {
            "plan":        plan,
            "research":    research_data,
            "answer":      final_answer,
            "explanation": explanation,
            "steps_log":   steps_log,
        }

from memory.vector_store import vector_store
from memory.mongo_store import save_task


class MemoryAgent:
    """Stores and retrieves task history using FAISS vector search (RAG)."""

    def retrieve(self, query: str) -> str:
        results = vector_store.search(query, k=3)
        if not results:
            return ""
        return "\n---\n".join(results)

    def store(self, task: str, answer: str):
        combined = f"Task: {task}\nAnswer: {answer}"
        vector_store.add(combined)

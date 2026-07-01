import numpy as np
from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False
    print("⚠️  FAISS not installed. Run: pip install faiss-cpu")


class VectorStore:
    def __init__(self, dim: int = 1536):
        self.dim   = dim
        self.texts = []
        if FAISS_AVAILABLE:
            self.index = faiss.IndexFlatL2(dim)
        else:
            self.index = None

    def embed(self, text: str) -> np.ndarray:
        response = client.embeddings.create(
            input=text,
            model="text-embedding-3-small",
        )
        return np.array(response.data[0].embedding, dtype="float32")

    def add(self, text: str):
        if not FAISS_AVAILABLE:
            self.texts.append(text)
            return
        vector = self.embed(text)
        self.index.add(np.array([vector]))
        self.texts.append(text)

    def search(self, query: str, k: int = 3) -> list[str]:
        if not self.texts:
            return []
        if not FAISS_AVAILABLE:
            # Simple fallback: return last k items
            return self.texts[-k:]
        vector = self.embed(query)
        k      = min(k, len(self.texts))
        _, indices = self.index.search(np.array([vector]), k)
        return [
            self.texts[i]
            for i in indices[0]
            if 0 <= i < len(self.texts)
        ]


# Singleton
vector_store = VectorStore()

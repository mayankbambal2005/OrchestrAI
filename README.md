# 🧠 OrchestrAI – Intelligent Multi-Agent System :

A web-based AI system where multiple specialized agents collaborate to solve
real-world tasks with planning, research, execution, critique, and memory.

---

##  Architecture :

```
User → React Frontend → FastAPI Backend → Orchestrator
                                              ├── Planner Agent
                                              ├── Research Agent
                                              ├── Execution Agent
                                              ├── Critic Agent
                                              └── Memory Agent
                                                    ├── FAISS (vector memory)
                                                    └── MongoDB (task history)
```

---

##  Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB running locally (or Atlas URI)

---

### 1. Clone / Extract the project

```bash
cd orchestrai
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your API keys

# Run the server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at:     http://localhost:8000/docs

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs at: http://localhost:3000

---

##  API Keys Required

| Key | Where to get | Free tier |
|-----|-------------|-----------|
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys | Pay-per-use |
| `SERPAPI_KEY` | https://serpapi.com | 100 searches/month |
| `MONGO_URI` | https://mongodb.com/atlas | 512MB free |

---

##  Project Structure

```
orchestrai/
├── backend/
│   ├── main.py                # FastAPI entry point
│   ├── orchestrator.py        # Master agent controller
│   ├── config.py              # Environment config
│   ├── requirements.txt
│   ├── .env.example           # → copy to .env
│   ├── agents/
│   │   ├── planner.py         # Task decomposition
│   │   ├── research.py        # Web search
│   │   ├── execution.py       # Answer generation
│   │   ├── critic.py          # Answer review
│   │   └── memory_agent.py    # RAG memory
│   ├── tools/
│   │   ├── web_search.py      # SerpAPI integration
│   │   ├── calculator.py      # Safe math eval
│   │   └── pdf_reader.py      # PDF text extraction
│   ├── memory/
│   │   ├── vector_store.py    # FAISS vector DB
│   │   └── mongo_store.py     # MongoDB CRUD
│   ├── models/
│   │   └── schemas.py         # Pydantic models
│   └── routes/
│       ├── task_routes.py     # WebSocket + feedback
│       └── history_routes.py  # Task history API
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                    # Root layout
        ├── main.jsx
        ├── index.css
        ├── hooks/
        │   └── useWebSocket.js        # Real-time WS hook
        ├── services/
        │   └── api.js                 # Axios API calls
        └── components/
            ├── ChatInterface.jsx      # Chat bubbles
            ├── AgentPanel.jsx         # Live agent activity
            ├── TaskHistory.jsx        # Past tasks dashboard
            ├── FeedbackBar.jsx        # Star rating
            └── ExplainPanel.jsx       # Reasoning display
```

---

##  Features

- **Multi-Agent Pipeline** – Planner → Research → Execution → Critic → Memory
- **Real-time Agent Visualization** – WebSocket broadcasts which agent is active
- **RAG Memory** – FAISS vector search retrieves relevant past context
- **Task History Dashboard** – MongoDB stores all tasks and ratings
- **Explainable AI** – Shows plan steps and critic review for every answer
- **Feedback Loop** – Star ratings stored per task for future improvement
- **Web Search Tool** – SerpAPI integration for live data
- **Calculator Tool** – Safe math expression evaluator
- **PDF Reader Tool** – Extract text from uploaded PDFs

---

##  Deployment

### Backend → Render.com
1. Push `backend/` folder to GitHub
2. Create new Web Service on render.com
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard

### Frontend → Vercel
1. Push `frontend/` folder to GitHub
2. Import project on vercel.com
3. Set env var: `VITE_API_URL=https://your-render-url.com/api`
4. Set env var: `VITE_WS_URL=wss://your-render-url.com/api/ws/task`
5. Deploy!

---

## Quick Reference

**What is OrchestrAI?**
> A multi-agent AI system where specialized agents (Planner, Researcher, Executor, Critic, Memory) collaborate via an Orchestrator to solve complex tasks better than a single AI model.

**Key concepts to know:**
- **Multi-Agent System** – Divide tasks among specialized AI agents
- **RAG** – Retrieval-Augmented Generation using FAISS vector search
- **WebSocket** – Enables real-time bidirectional communication
- **Vector Embedding** – Numerical representation of text meaning
- **Orchestrator Pattern** – Central controller routing between agents

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| AI | OpenAI GPT-4o-mini |
| Memory | FAISS (vectors), MongoDB (documents) |
| Real-time | WebSockets |
| Search Tool | SerpAPI |

---

##  Author

**Mayank Bambal** — [GitHub](https://github.com/mayankbambal2005) · [LinkedIn](https://linkedin.com/in/mayank-bambal-725835410)

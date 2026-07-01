from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.task_routes import router as task_router
from routes.history_routes import router as history_router
from auth.auth_routes import router as auth_router

app = FastAPI(title="OrchestrAI", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(auth_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "OrchestrAI is running 🚀"}

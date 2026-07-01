from fastapi import APIRouter
from memory.mongo_store import get_all_tasks

router = APIRouter()


@router.get("/history")
def get_history():
    tasks = get_all_tasks()
    return {"tasks": tasks}

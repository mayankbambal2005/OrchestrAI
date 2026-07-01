import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from models.schemas import TaskRequest, FeedbackRequest, TaskResponse
from orchestrator import Orchestrator
from memory.mongo_store import save_task, update_rating

router = APIRouter()


@router.websocket("/ws/task")
async def task_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        data      = await websocket.receive_text()
        payload   = json.loads(data)
        user_task = payload.get("task", "").strip()

        if not user_task:
            await websocket.send_json({"error": "Empty task"})
            return

        orchestrator = Orchestrator(websocket=websocket)
        result       = await orchestrator.run(user_task)

        task_id = save_task(user_task, result)
        result["task_id"] = task_id

        await websocket.send_json({"type": "final", "result": result})

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"type": "error", "message": str(e)})
    finally:
        try:
            await websocket.close()
        except Exception:
            pass


@router.post("/feedback")
def submit_feedback(body: FeedbackRequest):
    if not 1 <= body.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be 1–5")
    update_rating(body.task_id, body.rating)
    return {"message": "Feedback saved ✅"}

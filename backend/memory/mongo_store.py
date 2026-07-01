from datetime import datetime, timezone
from config import MONGO_URI, DB_NAME

try:
    from pymongo import MongoClient
    _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    _db     = _client[DB_NAME]
    MONGO_AVAILABLE = True
except Exception as e:
    print(f"⚠️  MongoDB not connected: {e}")
    MONGO_AVAILABLE = False
    _db = None


def save_task(task: str, result: dict, rating: int = 0) -> str:
    if not MONGO_AVAILABLE:
        print("MongoDB unavailable – task not saved.")
        return ""
    doc = {
        "task":      task,
        "result":    result,
        "rating":    rating,
        "createdAt": datetime.now(timezone.utc),
    }
    inserted = _db.tasks.insert_one(doc)
    return str(inserted.inserted_id)


def get_all_tasks() -> list[dict]:
    if not MONGO_AVAILABLE:
        return []
    tasks = list(_db.tasks.find({}, {"_id": 0}).sort("createdAt", -1).limit(50))
    return tasks


def update_rating(task_id: str, rating: int):
    if not MONGO_AVAILABLE:
        return
    from bson import ObjectId
    _db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"rating": rating}},
    )

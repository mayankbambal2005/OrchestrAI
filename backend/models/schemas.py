from pydantic import BaseModel
from typing import Optional


class TaskRequest(BaseModel):
    task: str


class FeedbackRequest(BaseModel):
    task_id: str
    rating:  int   # 1–5


class TaskResponse(BaseModel):
    plan:        list[str]
    research:    str
    answer:      str
    explanation: str
    steps_log:   list[dict]

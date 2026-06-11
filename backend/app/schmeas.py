from pydantic import BaseModel
from typing import Literal, Any

class StrokePayload(BaseModel):
    pathData: str
    color: str
    width: float
    userId: str | None = None

class CursorPayload(BaseModel):
    x: float
    y: float

class WSMessage(BaseModel):
    type: Literal["stroke", "cursor", "user_left", "user_joined"]
    userId: str
    userName: str
    payload: Any
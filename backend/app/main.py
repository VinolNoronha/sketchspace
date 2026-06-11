import json
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from app.websocket_manager import manager
from app.rooms import get_or_create_room
# from app.auth import verify_token, extract_user_info  # uncomment when Keycloak is ready



app = FastAPI(title="Whiteboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── HTTP endpoints ─────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/rooms")
def create_room_endpoint():
    from app.rooms import create_room
    room_id = create_room()
    return {"roomId": room_id}

# ── WebSocket endpoint ─────────────────────────────────────────────────────────

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    userId: str   = Query(...),
    userName: str = Query(...),
    # token: str  = Query(None),   # uncomment when Keycloak is ready
):
    # ── Auth (uncomment when Keycloak is wired) ──
    # if not token:
    #     await websocket.close(code=1008)
    #     return
    # try:
    #     payload = await verify_token(token)
    #     userId, userName = extract_user_info(payload)
    # except Exception:
    #     await websocket.close(code=1008)
    #     return

    # Ensure room exists
    get_or_create_room(room_id)

    # Connect this user
    await manager.connect(room_id, websocket, userId, userName)

    # Tell everyone else this user joined
    await manager.broadcast(
        room_id,
        {"type": "user_joined", "userId": userId, "userName": userName, "payload": {}},
        exclude=websocket,
    )

    try:
        while True:
            data = await websocket.receive_text()
            msg  = json.loads(data)

            msg_type = msg.get("type")

            # Attach server-side userId/userName so clients can't spoof others
            msg["userId"]   = userId
            msg["userName"] = userName

            if msg_type in ("stroke", "cursor", "undo", "redo", "clear"):
                # Broadcast to everyone else in the room
                await manager.broadcast(room_id, msg, exclude=websocket)

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
        await manager.broadcast(
            room_id,
            {"type": "user_left", "userId": userId, "userName": userName, "payload": {}},
        )
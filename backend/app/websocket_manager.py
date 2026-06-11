from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # room_id -> list of { ws, userId, userName }
        self.rooms: dict[str, list[dict]] = {}

    def get_room(self, room_id: str) -> list[dict]:
        return self.rooms.get(room_id, [])

    async def connect(
        self,
        room_id: str,
        websocket: WebSocket,
        user_id: str,
        user_name: str,
    ):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = []
        self.rooms[room_id].append({
            "ws": websocket,
            "userId": user_id,
            "userName": user_name,
        })

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id not in self.rooms:
            return
        self.rooms[room_id] = [
            c for c in self.rooms[room_id]
            if c["ws"] is not websocket
        ]
        if not self.rooms[room_id]:
            del self.rooms[room_id]

    async def broadcast(
        self,
        room_id: str,
        message: dict,
        exclude: WebSocket | None = None,
    ):
        for conn in self.get_room(room_id):
            if conn["ws"] is not exclude:
                try:
                    await conn["ws"].send_json(message)
                except Exception:
                    pass  # dead connection, skip

    def get_users(self, room_id: str) -> list[dict]:
        return [
            {"userId": c["userId"], "userName": c["userName"]}
            for c in self.get_room(room_id)
        ]


# single instance shared across the app
manager = ConnectionManager()
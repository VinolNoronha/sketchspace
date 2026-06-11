import secrets

_rooms: dict[str, dict] = {}

def create_room() -> str:
    room_id = secrets.token_hex(4)  # e.g. "d0b0fb9f"
    _rooms[room_id] = {"id": room_id}
    return room_id

def get_or_create_room(room_id: str) -> str:
    if room_id not in _rooms:
        _rooms[room_id] = {"id": room_id}
    return room_id

def room_exists(room_id: str) -> bool:
    return room_id in _rooms
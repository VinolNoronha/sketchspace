import os
import httpx
from jose import jwt, JWTError
from fastapi import HTTPException, status


KEYCLOAK_URL  = os.getenv("KEYCLOAK_URL",       "http://localhost:8080")
REALM         = os.getenv("KEYCLOAK_REALM",      "whiteboard-realm")
CLIENT_ID     = os.getenv("KEYCLOAK_CLIENT_ID",  "whiteboard-client")
JWKS_URL      = f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/certs"

_jwks_cache: dict | None = None

async def get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache:
        return _jwks_cache
    async with httpx.AsyncClient() as client:
        resp = await client.get(JWKS_URL)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        return _jwks_cache

async def verify_token(token: str) -> dict:
    try:
        jwks  = await get_jwks()
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            audience=CLIENT_ID,
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e}",
        )

def extract_user_info(payload: dict) -> tuple[str, str]:
    user_id   = payload.get("sub", "unknown")
    user_name = (
        payload.get("preferred_username")
        or payload.get("name")
        or user_id
    )
    return user_id, user_name
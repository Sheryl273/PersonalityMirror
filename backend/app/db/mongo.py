from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Optional
from uuid import uuid4

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings


class Mongo:
    def __init__(self) -> None:
        self._client: Optional[AsyncIOMotorClient] = None
        self._db: Optional[AsyncIOMotorDatabase] = None
        self._enabled: bool = False
        self._fallback: list[dict[str, Any]] = []

    async def connect(self) -> None:
        settings = get_settings()
        self._client = AsyncIOMotorClient(settings.mongodb_uri)
        self._db = self._client[settings.mongodb_db]
        # Best-effort connectivity check; if Mongo isn't available we still run.
        try:
            await self._client.admin.command("ping")
            self._enabled = True
        except Exception:
            self._enabled = False

    @property
    def db(self) -> AsyncIOMotorDatabase:
        if self._db is None:
            raise RuntimeError("Mongo is not connected")
        return self._db

    async def insert_analysis(self, payload: dict[str, Any]) -> str:
        doc = dict(payload)
        doc.setdefault("created_at", datetime.now(timezone.utc))
        if not self._enabled:
            doc["_fallback_id"] = str(uuid4())
            self._fallback.append(doc)
            return doc["_fallback_id"]
        result = await self.db.analyses.insert_one(doc)
        return str(result.inserted_id)

    async def get_timeline(self, limit: int) -> list[dict[str, Any]]:
        if not self._enabled:
            # Return oldest -> newest (charts expect forward time).
            items = sorted(self._fallback, key=lambda d: d.get("created_at"), reverse=False)
            return items[-limit:]

        cursor = self.db.analyses.find({}, {"_id": 0}).sort("created_at", -1).limit(limit)
        items: list[dict[str, Any]] = []
        async for doc in cursor:
            items.append(doc)
        items.reverse()
        return items


mongo = Mongo()


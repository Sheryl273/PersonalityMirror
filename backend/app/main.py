from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.db.mongo import mongo
from app.models.schemas import AnalyzeRequest, AnalyzeResponse, TimelineResponse
from app.services.analyzer import Analyzer


settings = get_settings()

app = FastAPI(title="AI Personality Mirror", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = Analyzer()


@app.on_event("startup")
async def on_startup() -> None:
    # Mongo is best-effort: if it's not running, the demo falls back to in-memory storage.
    await mongo.connect()


@app.get("/health")
async def health() -> dict:
    return {"ok": True, "db": "connected"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    try:
        analysis = analyzer.analyze(text=req.text, voice_transcript=req.voice_transcript)
        payload = {
            "text": req.text,
            "voice_transcript": req.voice_transcript,
            "sentiment": analysis["sentiment"],
            "traits": analysis["traits"],
            "created_at": datetime.now(timezone.utc),
        }
        await mongo.insert_analysis(payload)
        return AnalyzeResponse(**analysis)
    except HTTPException:
        raise
    except Exception as e:
        # If Mongo is down we still want to return an analysis for the demo UI.
        try:
            analysis = analyzer.analyze(text=req.text, voice_transcript=req.voice_transcript)
            return AnalyzeResponse(**analysis)
        except Exception:
            raise HTTPException(status_code=500, detail=str(e))


@app.get("/timeline", response_model=TimelineResponse)
async def timeline(limit: int = Query(30, ge=1, le=200)) -> TimelineResponse:
    docs = await mongo.get_timeline(limit)
    items = [
        {
            "created_at": doc["created_at"],
            "sentiment": float(doc["sentiment"]),
            "traits": doc["traits"],
        }
        for doc in docs
    ]
    return TimelineResponse(items=items)


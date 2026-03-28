from __future__ import annotations

from datetime import datetime
from typing import Dict, Optional

from pydantic import BaseModel, Field


class Traits(BaseModel):
    openness: float = Field(..., ge=0.0, le=1.0)
    conscientiousness: float = Field(..., ge=0.0, le=1.0)
    extraversion: float = Field(..., ge=0.0, le=1.0)
    agreeableness: float = Field(..., ge=0.0, le=1.0)
    neuroticism: float = Field(..., ge=0.0, le=1.0)


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1)
    voice_transcript: Optional[str] = None


class AnalyzeResponse(BaseModel):
    sentiment: float = Field(..., ge=-1.0, le=1.0)
    traits: Traits


class TimelinePoint(BaseModel):
    created_at: datetime
    sentiment: float
    traits: Traits


class TimelineResponse(BaseModel):
    items: list[TimelinePoint]


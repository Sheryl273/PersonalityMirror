from __future__ import annotations

from typing import Optional

from app.services.personality import PersonalityModel, extract_features, build_sklearn_personality_model
from app.core.config import get_settings


class Analyzer:
    def __init__(self) -> None:
        # Heavy imports are delayed to app startup where possible.
        self._sentiment_pipeline = None
        self._personality: Optional[PersonalityModel] = None

    def _ensure_initialized(self) -> None:
        if self._sentiment_pipeline is None or self._personality is None:
            from transformers import pipeline

            settings = get_settings()
            # Load model/pipeline. First run may download weights.
            self._sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model=settings.transformer_model,
            )
            self._personality = build_sklearn_personality_model()

    def analyze_text(self, text: str) -> dict:
        self._ensure_initialized()
        assert self._sentiment_pipeline is not None
        assert self._personality is not None

        text = text.strip()
        if not text:
            text = " "

        # Transformer sentiment: returns label and score.
        result = self._sentiment_pipeline(text[:6000])[0]
        label = result.get("label", "")
        score = float(result.get("score", 0.0))

        sentiment = score if label.upper().startswith("POS") else -score

        features = extract_features(text)
        traits = self._personality.predict_traits(features, sentiment=sentiment)

        return {"sentiment": sentiment, "traits": traits}

    def analyze(self, text: str, voice_transcript: Optional[str] = None) -> dict:
        # Optional voice transcript can be used as additional context.
        if voice_transcript:
            combined = f"{text}\n\nVoice transcript:\n{voice_transcript}"
        else:
            combined = text
        return self.analyze_text(combined)


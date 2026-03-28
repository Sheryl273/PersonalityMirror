import os
from functools import lru_cache


class Settings:
    def __init__(self) -> None:
        self.mongodb_uri: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        self.mongodb_db: str = os.getenv("MONGODB_DB", "personality_mirror")
        self.cors_origins: str = os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8000,http://127.0.0.1:8000",
        )
        self.transformer_model: str = os.getenv(
            "TRANSFORMER_SENTIMENT_MODEL",
            "distilbert-base-uncased-finetuned-sst-2-english",
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


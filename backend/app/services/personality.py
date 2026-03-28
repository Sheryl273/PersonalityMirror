from __future__ import annotations

import math
import re
from dataclasses import dataclass
from typing import Dict, List

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor


TRAIT_KEYS = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]


def _clip01(x: float) -> float:
    return float(max(0.0, min(1.0, x)))


def _sigmoid(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-x))


def extract_features(text: str) -> np.ndarray:
    """Feature vector used by the (simple) sklearn personality predictor."""
    words = re.findall(r"[A-Za-z]+", text)
    lower = text.lower()

    word_count = len(words)
    if word_count == 0:
        word_count = 1

    exclamation = text.count("!")
    question = text.count("?")
    commas = text.count(",")
    avg_word_len = float(sum(len(w) for w in words)) / max(1, word_count)

    first_person = len(re.findall(r"\b(i|me|my|mine|we|us|our|ours)\b", lower))
    second_person = len(re.findall(r"\b(you|your|yours)\b", lower))
    third_person = max(0, len(re.findall(r"\b(he|she|they|them|his|her|their)\b", lower)))

    negation = len(re.findall(r"\b(not|no|never|nothing|nowhere|none)\b", lower))
    emotion_terms = len(
        re.findall(
            r"\b(angry|anxious|nervous|worried|fear|afraid|sad|upset|excited|happy|confident|calm)\b",
            lower,
        )
    )

    # “Openness” keywords (tiny heuristic signal).
    openness_terms = len(
        re.findall(
            r"\b(imagine|creative|curious|explore|idea|thought|dream|art|future|novel|learn)\b",
            lower,
        )
    )

    # “Conscientiousness” keywords.
    conscientious_terms = len(
        re.findall(
            r"\b(plan|schedule|goal|commit|organize|organized|focus|diligent|consistent|reliable|finish)\b",
            lower,
        )
    )

    # “Agreeableness” keywords.
    agree_terms = len(
        re.findall(
            r"\b(kind|helpful|support|respect|agree|understand|listen|compassion|friendly)\b",
            lower,
        )
    )

    # Rough “tone” proxy: punctuation density.
    punctuation_density = (exclamation + question + commas) / max(1, word_count)

    # Transform sentiment (range [-1, 1]) into a feature proxy using sigmoids later.
    # For sklearn simplicity, keep sentiment external and append here as 0 placeholder.
    # The sklearn model expects a fixed-length vector; we append sentiment in the analyzer.
    # Order: word_count, avg_word_len, punctuation_density, exclamation, question,
    # first_person, second_person, third_person, negation, emotion_terms,
    # openness_terms, conscientious_terms, agree_terms
    return np.array(
        [
            float(word_count),
            avg_word_len,
            punctuation_density,
            float(exclamation),
            float(question),
            float(first_person),
            float(second_person),
            float(third_person),
            float(negation),
            float(emotion_terms),
            float(openness_terms),
            float(conscientious_terms),
            float(agree_terms),
        ],
        dtype=np.float32,
    )


@dataclass
class PersonalityModel:
    regressor: MultiOutputRegressor

    def predict_traits(self, features: np.ndarray, sentiment: float) -> Dict[str, float]:
        # Append normalized sentiment as final feature.
        x = np.concatenate([features, np.array([float(sentiment)], dtype=np.float32)], axis=0).reshape(1, -1)
        y = self.regressor.predict(x)[0]  # raw in approximately 0..1-ish range after training

        traits = {k: _clip01(float(v)) for k, v in zip(TRAIT_KEYS, y)}
        return traits


def build_sklearn_personality_model(seed: int = 42) -> PersonalityModel:
    """Builds a lightweight sklearn regressor trained on synthetic labels.

    This keeps the demo self-contained while still using scikit-learn for multi-trait prediction.
    """
    rng = np.random.default_rng(seed)
    n_samples = 600

    X: List[np.ndarray] = []
    Y: List[List[float]] = []

    for _ in range(n_samples):
        # Sample a plausible feature range consistent with extract_features().
        word_count = rng.integers(20, 400)
        avg_word_len = rng.uniform(3.0, 8.0)
        exclamation = rng.poisson(2.0)
        question = rng.poisson(1.0)
        commas = rng.poisson(4.0)
        punctuation_density = float(exclamation + question + commas) / float(max(1, word_count))
        first_person = rng.poisson(2.0)
        second_person = rng.poisson(1.0)
        third_person = rng.poisson(2.0)
        negation = rng.poisson(1.2)
        emotion_terms = rng.poisson(1.5)
        openness_terms = rng.poisson(1.8)
        conscientious_terms = rng.poisson(2.0)
        agree_terms = rng.poisson(1.6)
        sentiment = float(rng.uniform(-1.0, 1.0))

        features = np.array(
            [
                float(word_count),
                avg_word_len,
                punctuation_density,
                float(exclamation),
                float(question),
                float(first_person),
                float(second_person),
                float(third_person),
                float(negation),
                float(emotion_terms),
                float(openness_terms),
                float(conscientious_terms),
                float(agree_terms),
            ],
            dtype=np.float32,
        )

        # Synthetic “mapping” to Big Five traits.
        # Keep it bounded and interpretable.
        openness = _clip01(0.25 + 0.003 * word_count + 0.06 * (openness_terms / 3.0) - 0.02 * (avg_word_len / 6.0))
        conscientiousness = _clip01(
            0.25 + 0.04 * (conscientious_terms / 3.0) + 0.01 * (commas / 6.0) + 0.02 * _sigmoid(sentiment * 1.5)
        )
        extraversion = _clip01(0.22 + 0.06 * (first_person / 3.0) + 0.03 * (exclamation / 3.0) + 0.03 * _sigmoid(-negation))
        agreeableness = _clip01(0.25 + 0.05 * (agree_terms / 3.0) + 0.02 * (second_person / 2.0) + 0.01 * _sigmoid(sentiment))
        neuroticism = _clip01(
            0.18 + 0.05 * (negation / 2.0) + 0.04 * (emotion_terms / 3.0) + 0.05 * _sigmoid(-sentiment * 2.0)
        )

        # Add small noise.
        noise = rng.normal(0, 0.03, size=5)
        Y.append([openness + noise[0], conscientiousness + noise[1], extraversion + noise[2], agreeableness + noise[3], neuroticism + noise[4]])
        X.append(np.concatenate([features, np.array([sentiment], dtype=np.float32)]))

    X_arr = np.vstack(X)
    Y_arr = np.vstack(Y)

    rf = RandomForestRegressor(
        n_estimators=220,
        random_state=seed,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        n_jobs=-1,
    )
    reg = MultiOutputRegressor(rf)
    reg.fit(X_arr, Y_arr)
    return PersonalityModel(regressor=reg)


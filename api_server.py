"""SE Primer — Sunucu Tarafı ONNX Model Çıkarım API'si (FastAPI / api_server.py)
Bonus (+10 Puan) Gereksinimi:
Kendi sunucumuzda çalışan tüketici, aynı referans girdilerde aynı sonucu (< 1e-4 tolerans) üretir.

Çalıştırma:
    python api_server.py
    (veya uvicorn api_server:app --port 8000)
"""
import json
import sys
from pathlib import Path
from typing import List

import numpy as np
import onnxruntime as ort
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent
MODEL_PATH = ROOT_DIR / "model" / "model.onnx"
PARITE_PATH = ROOT_DIR / "tests" / "parite.json"

app = FastAPI(
    title="SE Primer: Night Shift ONNX Model Server",
    description="Sunucu tarafı yüksek performanslı ONNX model çıkarım ve diferansiyel parite doğrulama mikroservisi.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ONNX Runtime Oturumu
session: ort.InferenceSession = None


@app.on_event("startup")
def startup_event():
    global session
    if not MODEL_PATH.exists():
        raise RuntimeError(f"Model dosyası bulunamadı: {MODEL_PATH}")
    session = ort.InferenceSession(str(MODEL_PATH))
    print(f"✓ [FastAPI] model.onnx başarıyla yüklendi: {MODEL_PATH}")


class PredictionRequest(BaseModel):
    features: List[float]


class PredictionResponse(BaseModel):
    prob_panic: float
    prob_calm: float
    predicted_class: int
    status_text: str


@app.get("/")
def read_root():
    return {
        "service": "SE Primer Cognitive Overload & Panic Predictor API",
        "model_version": "2.0.0",
        "engine": "onnxruntime",
        "status": "online"
    }


@app.post("/predict")
def predict(req: PredictionRequest):
    if len(req.features) != 6:
        raise HTTPException(status_code=400, detail="Girdi vektörü tam 6 özellik içermelidir.")

    tensor_input = np.array([req.features], dtype=np.float32)
    outputs = session.run(["probabilities"], {"input": tensor_input})[0]
    prob_calm = float(outputs[0][0])
    prob_panic = float(outputs[0][1])
    predicted_class = 1 if prob_panic >= 0.5 else 0

    status = "Normal / Kontrollü"
    if prob_panic >= 0.65:
        status = "Bilişsel Aşırı Yüklenme (Panik)"
    elif prob_panic < 0.4:
        status = "Soğukkanlı Mühendis"

    return {
        "prob_panic": prob_panic,
        "prob_calm": prob_calm,
        "predicted_class": predicted_class,
        "status_text": status
    }


@app.get("/parity")
def verify_parity():
    """tests/parite.json dosyasındaki 5 referans girdiyi test eder ve < 1e-4 paritesini doğrular."""
    if not PARITE_PATH.exists():
        raise HTTPException(status_code=500, detail="parite.json bulunamadı.")

    data = json.loads(PARITE_PATH.read_text(encoding="utf-8"))
    tolerance = data.get("tolerance", 1e-4)
    cases = data["cases"]

    results = []
    max_diff = 0.0
    all_passed = True

    for c in cases:
        tensor_input = np.array([c["input"]], dtype=np.float32)
        outputs = session.run(["probabilities"], {"input": tensor_input})[0]
        actual_p = float(outputs[0][1])
        diff = abs(actual_p - c["expected_prob_panic"])
        if diff > max_diff:
            max_diff = diff
        passed = diff <= tolerance
        if not passed:
            all_passed = False

        results.append({
            "id": c["id"],
            "expected": c["expected_prob_panic"],
            "actual": actual_p,
            "diff": diff,
            "passed": passed
        })

    return {
        "all_passed": all_passed,
        "max_diff": max_diff,
        "tolerance": tolerance,
        "cases": results
    }


if __name__ == "__main__":
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000, reload=False)

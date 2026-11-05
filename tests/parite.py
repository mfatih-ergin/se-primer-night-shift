"""Python Referans Test Kahini (Oracle) — Diferansiyel Parite Testi (tests/parite.py)

Bu betik, 'model/model.onnx' dosyasını onnxruntime ile çalıştırarak 'tests/parite.json'
içindeki 5 kanonik referans girdi üzerinde tahmin üretir ve sayısal parite toleransını
(1e-4) doğrular.

Kullanım:
    python tests/parite.py
"""
import json
import sys
from pathlib import Path
import numpy as np
import onnxruntime as ort

# UTF-8 Konsol Desteği
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT_DIR / "model" / "model.onnx"
PARITE_JSON_PATH = ROOT_DIR / "tests" / "parite.json"


def run_parity_test():
    print("=" * 70)
    print("🔬 DİFERANSİYEL TEST KAHİNİ (ORACLE) PARİTE KONTROLÜ")
    print("=" * 70)

    if not MODEL_PATH.exists():
        sys.exit(f"✗ HATA: Model dosyası bulunamadı: {MODEL_PATH}")

    if not PARITE_JSON_PATH.exists():
        sys.exit(f"✗ HATA: Parite JSON referans dosyası bulunamadı: {PARITE_JSON_PATH}")

    data = json.loads(PARITE_JSON_PATH.read_text(encoding="utf-8"))
    tolerance = data.get("tolerance", 1e-4)
    cases = data["cases"]

    session = ort.InferenceSession(str(MODEL_PATH))
    print(f"✓ ONNX Modeli başarıyla yüklendi: {MODEL_PATH}")
    print(f"✓ İzin verilen sayısal hata toleransı: {tolerance:.1e}\n")

    all_passed = True

    for i, c in enumerate(cases, start=1):
        case_id = c["id"]
        tanim = c["tanim"]
        raw_input = c["input"]
        expected_p = c["expected_prob_panic"]

        # Tensör oluştur [1, 6] float32
        tensor_input = np.array([raw_input], dtype=np.float32)
        outputs = session.run(["probabilities"], {"input": tensor_input})[0]
        actual_p = float(outputs[0][1])

        diff = abs(actual_p - expected_p)
        passed = diff <= tolerance

        status_icon = "✓" if passed else "✗"
        print(f"[{i}/5] {status_icon} Vaka: {case_id}")
        print(f"    Tanım: {tanim}")
        print(f"    Girdi: {raw_input}")
        print(f"    Beklenen (Oracle): {expected_p:.6f} | Hesaplanan: {actual_p:.6f}")
        print(f"    Mutlak Fark: {diff:.2e} (Tolerans: {tolerance:.1e})")

        if not passed:
            all_passed = False
            print(f"    ✗ HATA: Sayısal parite toleransı aşıldı!")
        print("-" * 70)

    if not all_passed:
        print("✗ DİFERANSİYEL PARİTE TESTİ BAŞARISIZ OLDU!")
        sys.exit(1)

    print("✨ TÜM DİFERANSİYEL PARİTE TESTLERİ BAŞARIYLA GEÇTİ (HATA < 1e-4)!")


if __name__ == "__main__":
    run_parity_test()

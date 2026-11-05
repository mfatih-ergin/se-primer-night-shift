"""SE Primer — Night Shift: Bilişsel Aşırı Yüklenme ve Panik Tahmini Modeli (COPP)
Tekrarlanabilir Eğitim, Değerlendirme Kapısı (Eval Gate) ve ONNX Paketleyici.

Kullanım:
    python train.py
"""
import json
import shutil
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# UTF-8 Konsol Desteği
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent
DATA_PATH = ROOT_DIR / "data" / "oturumlar.csv"
MODEL_DIR = ROOT_DIR / "model"
PUBLIC_DIR = ROOT_DIR / "public"
TESTS_DIR = ROOT_DIR / "tests"

SEED = 42

# Eğitim Öncesi spec.md'de Belirlenen Altın Standart Kabul Eşikleri (Eval Gate)
KABUL_ESIGI_ACCURACY = 0.80
KABUL_ESIGI_AUC = 0.82
KABUL_ESIGI_PARITE_TOLERANS = 1e-4

# Model Girdi Özellikleri (Sıra ve İsimler Sözleşmedir)
OZELLIKLER = [
    "seviye_kod",
    "sahne_no",
    "karar_suresi_sn",
    "secenek_degistirme_sayisi",
    "ipucu_tiklama_sayisi",
    "onceki_asama_hatasi"
]
HEDEF = "panik_durumu"


def egitim_ve_paketleme():
    print("=" * 70)
    print("🚀 SE PRIMER MODEL EĞİTİMİ VE EVAL KAPISI (train.py)")
    print(f"Sabit Tohum (Seed): {SEED}")
    print(f"Kabul Eşikleri -> Accuracy >= {KABUL_ESIGI_ACCURACY}, ROC-AUC >= {KABUL_ESIGI_AUC}")
    print("=" * 70)

    if not DATA_PATH.exists():
        sys.exit(f"✗ HATA: Veri seti bulunamadı: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    print(f"✓ Veri yüklendi: {len(df)} satır (Gerçek: {sum(df['kaynak'] == 'gercek')}, Sentetik: {sum(df['kaynak'] == 'sentetik')})")

    X = df[OZELLIKLER]
    y = df[HEDEF]

    # %30 Test Bölmesi (Stratified ve Sabit Seed)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.30, random_state=SEED, stratify=y
    )
    print(f"✓ Veri bölündü: Eğitim={len(X_train)} satır, Test={len(X_test)} satır")

    # Scikit-Learn Pipeline: StandardScaler + LogisticRegression
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", LogisticRegression(random_state=SEED, max_iter=1000, C=1.0))
    ])

    pipeline.fit(X_train, y_train)

    # Test Kümesi Tahminleri ve Metrikler
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    acc = round(float(accuracy_score(y_test, y_pred)), 4)
    auc = round(float(roc_auc_score(y_test, y_prob)), 4)
    f1 = round(float(f1_score(y_test, y_pred)), 4)
    prec = round(float(precision_score(y_test, y_pred)), 4)
    rec = round(float(recall_score(y_test, y_pred)), 4)

    metrikler = {
        "accuracy": acc,
        "roc_auc": auc,
        "f1_score": f1,
        "precision": prec,
        "recall": rec
    }

    print("\n📊 TEST DEĞERLENDİRME SONUÇLARI:")
    for k, v in metrikler.items():
        print(f"   • {k:15}: {v}")

    # ================= EVAL GATE (KABUL KAPISI) KONTROLÜ =================
    print("\n🔍 EVAL GATE (KABUL EŞİĞİ) DENETLENİYOR...")
    if acc < KABUL_ESIGI_ACCURACY or auc < KABUL_ESIGI_AUC:
        print(f"✗ HATA: Model belirlenen kalite eşiğini geçemedi!")
        print(f"  Gerekli: Accuracy >= {KABUL_ESIGI_ACCURACY}, AUC >= {KABUL_ESIGI_AUC}")
        print(f"  Elde Edilen: Accuracy = {acc}, AUC = {auc}")
        print("  -> Artefakt paketlenmesi DURDURULDU. Model yayınlanamaz!")
        sys.exit(1)

    print(f"✓ EVAL GATE GEÇİLDİ! Model altın standart eşiklerini başarıyla karşıladı.")

    # Model Dizini Hazırlığı
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    TESTS_DIR.mkdir(parents=True, exist_ok=True)

    # 1. joblib Kaydet
    joblib.dump(pipeline, MODEL_DIR / "model.joblib")
    print(f"✓ model.joblib kaydedildi.")

    # 2. ONNX'e Dönüştür ve Parite Kontrolü Yap
    onnx_yolu = MODEL_DIR / "model.onnx"
    onnx_aktar_ve_dogrula(pipeline, X_test, onnx_yolu)

    # Web uygulamasının doğrudan çekebilmesi için public/ içine de kopyala
    shutil.copy2(onnx_yolu, PUBLIC_DIR / "model.onnx")
    print(f"✓ public/model.onnx güncellendi.")

    # 3. config.json Oluştur (Sözleşme & Şema)
    ornek_girdi = {col: float(X_test.iloc[0][col]) for col in OZELLIKLER}
    config = {
        "title": "SE Primer: Bilişsel Aşırı Yüklenme ve Panik Tahmini Modeli (COPP)",
        "version": "2.0.0",
        "description": "Oyuncunun karar süresi, tıklama kararsızlığı ve hata geçmişinden yararlanarak kriz anındaki panik/aşırı yüklenme olasılığını saniyenin binde birinde tahmin eden dikey ONNX modeli.",
        "target": HEDEF,
        "class_labels": {
            "0": "Normal / Kontrollü",
            "1": "Bilişsel Aşırı Yüklenme (Panik)"
        },
        "features": [
            {"name": col, "type": "float32", "example": float(ornek_girdi[col])}
            for col in OZELLIKLER
        ],
        "classes": ["0", "1"],
        "metrics": metrikler,
        "eval_gate_thresholds": {
            "min_accuracy": KABUL_ESIGI_ACCURACY,
            "min_roc_auc": KABUL_ESIGI_AUC,
            "max_parity_diff": KABUL_ESIGI_PARITE_TOLERANS
        },
        "seed": SEED,
        "sklearn_version": sklearn.__version__,
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    }

    config_str = json.dumps(config, indent=2, ensure_ascii=False)
    (MODEL_DIR / "config.json").write_text(config_str, encoding="utf-8")
    (PUBLIC_DIR / "config.json").write_text(config_str, encoding="utf-8")
    print(f"✓ model/config.json ve public/config.json sözleşmesi yazıldı.")

    # 4. Model Kartı (model/README.md)
    model_karti_yaz(config, MODEL_DIR / "README.md")
    print(f"✓ model/README.md (Model Kartı) oluşturuldu.")

    # 5. Diferansiyel Test İçin 5 Referans Girdi ve Çıktı (tests/parite.json)
    parite_referans_uret(pipeline, TESTS_DIR / "parite.json")
    print(f"✓ tests/parite.json referans kahin (oracle) dosyası üretildi.")

    print("\n" + "=" * 70)
    print("✨ TÜM MODEL ARTEFAKTLARI VE SÖZLEŞMELER EKSİKSİZ ÜRETİLDİ!")
    print("=" * 70)


def onnx_aktar_ve_dogrula(model, X_ornek, onnx_yolu):
    """Pipeline modelini ONNX formatına dönüştürür ve sklearn ile parite doğrulaması yapar."""
    import onnxruntime as ort
    from skl2onnx import to_onnx
    from skl2onnx.common.data_types import FloatTensorType

    initial_type = [("input", FloatTensorType([None, len(OZELLIKLER)]))]
    onx = to_onnx(
        model,
        initial_types=initial_type,
        options={id(model): {"zipmap": False}},
        target_opset=17
    )

    onnx_yolu.write_bytes(onx.SerializeToString())

    # Parite / Eşdeğerlik Doğrulaması (Test Kahini)
    session = ort.InferenceSession(str(onnx_yolu))
    input_data = X_ornek.to_numpy(dtype=np.float32)
    onnx_probs = session.run(["probabilities"], {"input": input_data})[0]
    sklearn_probs = model.predict_proba(X_ornek)

    max_diff = float(np.abs(onnx_probs - sklearn_probs).max())
    print(f"✓ ONNX dönüşümü başarılı. Sklearn ile maksimum parite farkı: {max_diff:.2e}")

    if max_diff > KABUL_ESIGI_PARITE_TOLERANS:
        sys.exit(f"✗ HATA: ONNX ile Scikit-Learn arasındaki fark kabul toleransını ({KABUL_ESIGI_PARITE_TOLERANS}) aştı: {max_diff:.2e}")


def parite_referans_uret(model, out_path):
    """Diferansiyel test için 5 adet kanonik referans girdi ve Python Oracle olasılıklarını kaydeder."""
    referanslar = [
        # 1. Soğukkanlı Senior Mühendis (Hızlı, hatasız, az kararsızlık)
        {
            "id": "ref_1_calm_senior",
            "tanim": "Soğukkanlı Senior SRE (Aşama 1, 12 saniye, 0 kararsızlık)",
            "input": [1.0, 1.0, 12.0, 0.0, 0.0, 0.0]
        },
        # 2. Aşırı Yüklenmiş Junior Mühendis (Uzun süre, çok tıklama, önceki hata)
        {
            "id": "ref_2_overloaded_junior",
            "tanim": "Bilişsel Aşırı Yüklenme Yaşayan Junior (Aşama 2, 45 saniye, 4 kararsızlık, hata var)",
            "input": [0.0, 2.0, 45.0, 4.0, 3.0, 1.0]
        },
        # 3. Dengeli Orta Seviye Mühendis
        {
            "id": "ref_3_balanced_mid",
            "tanim": "Dengeli Mühendis (Aşama 2, 25 saniye, 1 kararsızlık, 1 ipucu)",
            "input": [0.0, 2.0, 25.0, 1.0, 1.0, 0.0]
        },
        # 4. Son Saniyede Panikleyen Senior
        {
            "id": "ref_4_late_panic_senior",
            "tanim": "Sürenin Sonuna Gelen Senior (Aşama 3, 55 saniye, 3 kararsızlık, 2 ipucu)",
            "input": [1.0, 3.0, 55.0, 3.0, 2.0, 1.0]
        },
        # 5. Hızlı ve Kararlı Junior
        {
            "id": "ref_5_quick_junior",
            "tanim": "Hızlı ve Net Karar Veren Junior (Aşama 1, 15 saniye, 0 kararsızlık)",
            "input": [0.0, 1.0, 15.0, 0.0, 0.0, 0.0]
        }
    ]

    for item in referanslar:
        df_row = pd.DataFrame([item["input"]], columns=OZELLIKLER)
        probs = model.predict_proba(df_row)[0]
        item["expected_prob_panic"] = round(float(probs[1]), 6)
        item["expected_class"] = int(np.argmax(probs))

    payload = {
        "description": "Python Referans Test Kahini (Oracle) Parite Girdileri ve Beklenen Olasılıklar",
        "tolerance": KABUL_ESIGI_PARITE_TOLERANS,
        "features": OZELLIKLER,
        "cases": referanslar
    }

    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


def model_karti_yaz(config, card_path):
    features_md = "\n".join(f"- `{f['name']}` ({f['type']}) — Örnek: {f['example']}" for f in config["features"])
    metrics_md = "\n".join(f"| {k} | {v} |" for k, v in config["metrics"].items())

    kart = f"""---
library_name: sklearn
tags:
- onnx
- tabular-classification
- scikit-learn
- software-engineering-education
- socratic-tutor
pipeline_tag: tabular-classification
---

# {config["title"]}

{config["description"]}

## 1. Model Mimarisi ve Eğitim Ortamı
- **Algoritma:** Scikit-Learn `Pipeline(StandardScaler → LogisticRegression(random_state={config["seed"]}))`
- **Hedef Donanım/Ortam:** Tarayıcı (Web Assembly / `onnxruntime-web`) ve Python Test Kahini (`onnxruntime`)
- **Python Sürümü:** {config["python_version"]}
- **Scikit-Learn Sürümü:** {config["sklearn_version"]}
- **ONNX Opset:** 17 (Düz Tensör, zipmap=False)

## 2. Model Metrikleri (%30 Bağımsız Test Kümesi)
| Metrik | Değer |
|---|---|
{metrics_md}

## 3. Kabul Eşikleri (Eval Gate)
- Minimum Accuracy: `{config["eval_gate_thresholds"]["min_accuracy"]}` (Gerçekleşen: `{config["metrics"]["accuracy"]}`)
- Minimum ROC-AUC: `{config["eval_gate_thresholds"]["min_roc_auc"]}` (Gerçekleşen: `{config["metrics"]["roc_auc"]}`)
- Maksimum Parite Hata Toleransı: `{config["eval_gate_thresholds"]["max_parity_diff"]}`

## 4. Girdi Özellikleri (Feature Contract)
{features_md}

## 5. Kullanım ve Çıkarım
### Python (Yerel Çıkarım):
```python
import onnxruntime as ort
import numpy as np

session = ort.InferenceSession("model.onnx")
# Girdi boyutu: [1, 6] float32 tensörü
ornek = np.array([[1.0, 1.0, 12.0, 0.0, 0.0, 0.0]], dtype=np.float32)
sonuc = session.run(["probabilities"], {{"input": ornek}})[0]
panik_olasiligi = float(sonuc[0][1])
print(f"Panik Olasılığı: {{panik_olasiligi:.4f}}")
```

### Tarayıcıda Doğrudan Çıkarım (`onnxruntime-web`):
```javascript
import * as ort from 'onnxruntime-web';
const session = await ort.InferenceSession.create('model.onnx');
const tensor = new ort.Tensor('float32', Float32Array.from([1, 1, 12, 0, 0, 0]), [1, 6]);
const results = await session.run({{ input: tensor }});
const pPanic = results.probabilities.data[1];
```

## 6. Sınırlar ve Kullanılmaması Gereken Durumlar
- Bu model gerçek klinik veya tıbbi anksiyete/panik teşhisi koyamaz.
- Yalnızca interaktif simülatördeki telemetriye dayalı pedagojik bir destek bileşenidir.
"""
    card_path.write_text(kart, encoding="utf-8")


if __name__ == "__main__":
    egitim_ve_paketleme()

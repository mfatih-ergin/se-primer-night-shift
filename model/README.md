---
library_name: sklearn
tags:
- onnx
- tabular-classification
- scikit-learn
- software-engineering-education
- socratic-tutor
pipeline_tag: tabular-classification
---

# SE Primer: Bilişsel Aşırı Yüklenme ve Panik Tahmini Modeli (COPP)

Oyuncunun karar süresi, tıklama kararsızlığı ve hata geçmişinden yararlanarak kriz anındaki panik/aşırı yüklenme olasılığını saniyenin binde birinde tahmin eden dikey ONNX modeli.

## 1. Model Mimarisi ve Eğitim Ortamı
- **Algoritma:** Scikit-Learn `Pipeline(StandardScaler → LogisticRegression(random_state=42))`
- **Hedef Donanım/Ortam:** Tarayıcı (Web Assembly / `onnxruntime-web`) ve Python Test Kahini (`onnxruntime`)
- **Python Sürümü:** 3.13.0
- **Scikit-Learn Sürümü:** 1.9.1
- **ONNX Opset:** 17 (Düz Tensör, zipmap=False)

## 2. Model Metrikleri (%30 Bağımsız Test Kümesi)
| Metrik | Değer |
|---|---|
| accuracy | 1.0 |
| roc_auc | 1.0 |
| f1_score | 1.0 |
| precision | 1.0 |
| recall | 1.0 |

## 3. Kabul Eşikleri (Eval Gate)
- Minimum Accuracy: `0.8` (Gerçekleşen: `1.0`)
- Minimum ROC-AUC: `0.82` (Gerçekleşen: `1.0`)
- Maksimum Parite Hata Toleransı: `0.0001`

## 4. Girdi Özellikleri (Feature Contract)
- `seviye_kod` (float32) — Örnek: 1.0
- `sahne_no` (float32) — Örnek: 1.0
- `karar_suresi_sn` (float32) — Örnek: 15.0
- `secenek_degistirme_sayisi` (float32) — Örnek: 0.0
- `ipucu_tiklama_sayisi` (float32) — Örnek: 0.0
- `onceki_asama_hatasi` (float32) — Örnek: 0.0

## 5. Kullanım ve Çıkarım
### Python (Yerel Çıkarım):
```python
import onnxruntime as ort
import numpy as np

session = ort.InferenceSession("model.onnx")
# Girdi boyutu: [1, 6] float32 tensörü
ornek = np.array([[1.0, 1.0, 12.0, 0.0, 0.0, 0.0]], dtype=np.float32)
sonuc = session.run(["probabilities"], {"input": ornek})[0]
panik_olasiligi = float(sonuc[0][1])
print(f"Panik Olasılığı: {panik_olasiligi:.4f}")
```

### Tarayıcıda Doğrudan Çıkarım (`onnxruntime-web`):
```javascript
import * as ort from 'onnxruntime-web';
const session = await ort.InferenceSession.create('model.onnx');
const tensor = new ort.Tensor('float32', Float32Array.from([1, 1, 12, 0, 0, 0]), [1, 6]);
const results = await session.run({ input: tensor });
const pPanic = results.probabilities.data[1];
```

## 6. Sınırlar ve Kullanılmaması Gereken Durumlar
- Bu model gerçek klinik veya tıbbi anksiyete/panik teşhisi koyamaz.
- Yalnızca interaktif simülatördeki telemetriye dayalı pedagojik bir destek bileşenidir.

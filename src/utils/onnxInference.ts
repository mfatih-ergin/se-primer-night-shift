import * as ort from 'onnxruntime-web';

// Wasm yolu ve multi-threading ayarları
// Tarayıcı ortamında wasm dosyalarını unpkg / cdn veya yerel dizinden yükler
ort.env.wasm.numThreads = 1;

let sessionPromise: Promise<ort.InferenceSession> | null = null;

export async function getInferenceSession(): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = ort.InferenceSession.create('/model.onnx', {
      executionProviders: ['wasm'],
    });
  }
  return sessionPromise;
}

export interface ModelPrediction {
  probPanic: number;
  probCalm: number;
  predictedClass: number;
  statusText: string;
}

/**
 * Verilen telemetri vektörü için panik olasılığı çıkarımı yapar.
 * Özellikler sırası:
 * 0: seviye_kod (0=Junior, 1=Senior)
 * 1: sahne_no (1, 2, 3)
 * 2: karar_suresi_sn (saniye)
 * 3: secenek_degistirme_sayisi (adet)
 * 4: ipucu_tiklama_sayisi (adet)
 * 5: onceki_asama_hatasi (0=Doğru, 1=Hata)
 */
export async function predictPanic(features: number[]): Promise<ModelPrediction> {
  try {
    const session = await getInferenceSession();
    const inputTensor = new ort.Tensor('float32', Float32Array.from(features), [1, features.length]);
    const results = await session.run({ input: inputTensor });

    // Output: probabilities tensörü [1, 2]
    const probs = results.probabilities.data as Float32Array;
    const probCalm = Number(probs[0]);
    const probPanic = Number(probs[1]);
    const predictedClass = probPanic >= 0.5 ? 1 : 0;

    let statusText = 'Normal / Kontrollü';
    if (probPanic >= 0.65) {
      statusText = 'Bilişsel Aşırı Yüklenme (Panik)';
    } else if (probPanic < 0.4) {
      statusText = 'Soğukkanlı Mühendis';
    } else {
      statusText = 'Dengeli Değerlendirme';
    }

    return {
      probPanic,
      probCalm,
      predictedClass,
      statusText,
    };
  } catch (error) {
    console.error('ONNX çıkarım hatası:', error);
    // Fallback: Model yüklenemezse güvenli varsayılan
    return {
      probPanic: 0.2,
      probCalm: 0.8,
      predictedClass: 0,
      statusText: 'Kural Motoru (Fallback)',
    };
  }
}

export interface ParityResult {
  id: string;
  tanim: string;
  input: number[];
  expectedProbPanic: number;
  actualProbPanic: number;
  diff: number;
  passed: boolean;
}

export async function runInBrowserParitySuite(): Promise<{
  results: ParityResult[];
  maxDiff: number;
  tolerance: number;
  allPassed: boolean;
}> {
  const resp = await fetch('/parite.json');
  const data = await resp.json();
  const tolerance = data.tolerance || 1e-4;
  const cases = data.cases;

  const results: ParityResult[] = [];
  let maxDiff = 0;
  let allPassed = true;

  for (const c of cases) {
    const pred = await predictPanic(c.input);
    const diff = Math.abs(pred.probPanic - c.expected_prob_panic);
    if (diff > maxDiff) maxDiff = diff;
    const passed = diff <= tolerance;
    if (!passed) allPassed = false;

    results.push({
      id: c.id,
      tanim: c.tanim,
      input: c.input,
      expectedProbPanic: c.expected_prob_panic,
      actualProbPanic: pred.probPanic,
      diff,
      passed,
    });
  }

  return {
    results,
    maxDiff,
    tolerance,
    allPassed,
  };
}

// Window globaline bağla (Cypress ve konsol testleri için)
if (typeof window !== 'undefined') {
  (window as any).predictPanic = predictPanic;
  (window as any).runInBrowserParitySuite = runInBrowserParitySuite;
}

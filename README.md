# SE Primer — Night Shift: Season 5 Zero Hour (v2.0 Adaptif ONNX Sürümü)

> **YZM301 - Yazılım Gerçekleme ve Test Dersi (Ödev 6 & 7)**  
> Neal Stephenson'ın _The Diamond Age_ eserindeki _"A Young Lady's Illustrated Primer"_ konseptinden esinlenen; statik kurallar yerine **oyuncunun davranışsal telemetrisinden öğrenen, istemci tarafında koşan dikey bir ONNX makine öğrenmesi modeliyle (COPP)** kişiselleşen interaktif yazılım mühendisliği kriz simülatörü.

---

## 📌 Proje Künyesi ve Teslim Bağlantıları

- **Adı Soyadı:** Muhammet Fatih ERGİN
- **Öğrenci No:** 241478059
- **E-Posta:** f.ergin162@gmail.com
- **GitHub Deposu:** [https://github.com/mfatih-ergin/se-primer-night-shift](https://github.com/mfatih-ergin/se-primer-night-shift)
- **Hugging Face Model Deposu (Commit'e Sabitlenmiş):** [https://huggingface.co/Fatih162/se-primer-panic-onnx/resolve/36bff0c0cdbe2887ea05a0f71e0afd53209921d2/model.onnx](https://huggingface.co/Fatih162/se-primer-panic-onnx)
- **Canlı Web Uygulama Linki (GitHub Pages & AI Studio):**
  - [GitHub Pages Canlı Uygulama](https://mfatih-ergin.github.io/se-primer-night-shift/)
  - [Google AI Studio Canlı Uygulama](https://ai.studio/apps/ed7624a7-bad7-42e3-afdd-106f4167fd0c?fullscreenApplet=true)
- **YouTube Demo Videosu:** [https://youtu.be/_5S39nzm7bA](https://youtu.be/_5S39nzm7bA)
- **83 Saniyelik Adaptif Model Demo Videosu (Yerel Dosya):** `cypress/videos/demo_video.cy.js.mp4`
- **7/7 E2E ve Diferansiyel Parite Test Videosu:** `cypress/videos/simulator.cy.js.mp4`

---

## ⚡ Hızlı Başlangıç (En Fazla 3 Komutla Çalıştırma)

```bash
# 1. Bağımlılıkları yükleyin (Node.js & Python)
npm install && pip install scikit-learn onnx onnxruntime skl2onnx fastapi uvicorn

# 2. Tekrarlanabilir model eğitimini ve Eval Kapısını (Gate) çalıştırın
python train.py

# 3. Diferansiyel parite testini ve Cypress E2E test süitini koşturun
python tests/parite.py && node run-tests.js
```

---

## 🧠 v2.0 Yeniliği: Bilişsel Aşırı Yüklenme & Panik Tahmini Modeli (COPP)

v1.0 sürümündeki statik `if/else` kural motoru yerine; kullanıcının kriz esnasındaki mikro davranışlarını tarayıcı içinde yerel olarak izleyen dikey bir ONNX makine öğrenmesi modeli entegre edilmiştir:

1. **Girdi Özellikleri (Telemetri Vektörü):**
   - `seviye_kod` (Junior: 0, Senior: 1)
   - `sahne_no` (1, 2, 3)
   - `karar_suresi_sn` (Saniyeler cinsinden karar tereddüt süresi)
   - `secenek_degistirme_sayisi` (A ve B kartları arasında gidip gelme sayısı)
   - `ipucu_tiklama_sayisi` (Sokratik mentora danışma adedi)
   - `onceki_asama_hatasi` (Önceki kararda patlama yaşandı mı?)
2. **Çıktı & Adaptif Davranış:**
   - Model tarayıcıda `onnxruntime-web` ile saniyenin binde birinde ($< 2\text{ms}$) çıkarım yapar.
   - **$P(\text{panik}) \ge 0.65$:** `🧠 BİLİŞSEL AŞIRI YÜKLENME // PANİK` alarmı çalar. Sokratik Danışman otomatik olarak devreye girip zihni toparlayıcı mimari ipucunu açar ve süre sayacı dondurulur.
   - **$P(\text{panik}) < 0.40$:** `🎯 SOĞUKKANLI MÜHENDİS` modu devreye girer; arayüz gürültüsü gizlenir ve derin dağıtık telemetri (P99, connection pool) görünür kılınır.

---

## 📊 Veri Seti Metodolojisi (`data/oturumlar.csv`)

- **Gerçek Oturumlar:** 6 farklı katılımcıya 3'er aşama oynatılarak **18 gerçek oturum kararı** toplanmıştır (`kaynak: "gercek"`).
- **Sentetik Veri Üretimi:** `SEED = 42` tohumuyla kriz dinamiklerine uygun 102 sentetik karar satırı üretilmiştir (`kaynak: "sentetik"`). Toplam 120 satır.
- **Sentetik Üretici Kuralı:** Karar süresi $> 38\text{sn}$, kararsızlık $\ge 2$ ve önceki hata $= 1$ olan profillerde panik olasılığı %88; hızlı kararlarda (%8) olacak şekilde modellenmiştir.
- **KVKK Uyumu:** Kişisel hiçbir veri (ad, e-posta, IP vb.) toplanmamış; rastgele `sess_...` kimlikleri kullanılmıştır.
- **Veri Sözlüğü:** [`data/SOZLUK.md`](data/SOZLUK.md) dosyasında tüm değişkenler tanımlanmıştır.

---

## 🔬 Somut Artefaktlar ve Diferansiyel Test (Parite Testi)

Sommerville Bölüm 8 (V&V) ilkesi gereğince sistemde iki bağımsız tüketici bulunmaktadır:
1. **İstemci Tüketicisi:** Tarayıcıda `onnxruntime-web` ile çalışan web uygulaması.
2. **Test Kahini (Oracle):** `model.onnx` dosyasını bağımsız çalıştıran Python betiği (`tests/parite.py`).

- **Diferansiyel Test:** [`tests/parite.json`](tests/parite.json) içindeki 5 referans girdi üzerinde Python Oracle çıktısı ile tarayıcı ONNX çıktısı kıyaslanır.
- **Hata Toleransı:** Mutlak fark $|\Delta| \le 10^{-4}$ (`1e-4`) olmak zorundadır. Yapılan testlerde maksimum sapma **$9.91 \times 10^{-8}$** olarak doğrulanmış ve tüm testler geçmiştir.
- **Sunucu API (Bonus +10):** [`api_server.py`](api_server.py) FastAPI mikroservisi ile aynı referans çıktıyı sunucu tarafında da sunmaktadır.

---

## 🚀 Güvenli Dağıtım ve Mimari Ödünleşimler (`RELEASE.md`)

- **Geri Alma (Rollback):** Modelde sapma görülürse `USE_ML_INFERENCE: false` bayrağıyla anında v1.0 deterministik kural motoruna dönülür.
- **Dağıtım Stratejisi:** Gölge Dağıtım (Shadow) $\rightarrow$ Kanarya Dağıtımı (%5) $\rightarrow$ Aşamalı Geçiş (%25 $\rightarrow$ %50 $\rightarrow$ %100).
- **Ödünleşim Matrisi:** Tarayıcı içi çıkarım, mobil cihaz içi gömülü ve bulut sunucu mimarilerinin gecikme, KVKK ve model gizliliği açısından detaylı kıyaslaması [`RELEASE.md`](RELEASE.md) dosyasında sunulmuştur.

---

## 📝 Vize Sınavı Tasarımı Düşünce Egzersizi (`SINAV_TASARIMI.md`)

Neal Stephenson'ın uyarlamalı Primer vizyonundan hareketle, ezberi değil kavramların gerçek özünü ve mühendislik gerekçesini ölçen özgün klasik sınav sorusu ve çeldirici analizleri [`SINAV_TASARIMI.md`](SINAV_TASARIMI.md) dosyasında 1 sayfa olarak belgelenmiştir.

---

## 🤖 Coding Agent Yönetim Beyanı

Bu ödev sürecinde yapay zekâ kodlama ajanı (Antigravity / Gemini) bir pair-programming ortağı olarak kullanılmış; süreci yöneten mühendis olarak aşağıdaki müdahaleler bizzat gerçekleştirilmiştir:
1. **Model Hedefinin Belirlenmesi:** Ajanın önerdiği standart hazır örnekler yerine, Season 5 kriz temasına özgü "Bilişsel Aşırı Yüklenme ve Panik Tahmini" senaryosu seçilmiş ve girdi vektörü mimarisi tasarlanmıştır.
2. **Windows Konsol Kodlama Hataları:** Python 3.13 ortamında Windows CP1254 karakter kodlaması kaynaklı terminal çöküşleri tespit edilmiş ve `sys.stdout.reconfigure(encoding='utf-8')` ile elle düzeltilmiştir.
3. **JSX Aritmetik Kaçış Hatası:** `ParityTestModal.tsx` bileşeninde matematiksel KaTeX ifadesinin JSX derleyicisi tarafından nesne sanılarak patlatılması elle yakalanmış ve sözdizimi onarılmıştır.
4. **Cypress E2E Entegrasyonu:** Standart test süitine ek olarak, hem arayüz üzerinden hem de arka planda çalışan WebAssembly parite testini (`data-cy="parity-modal"`) denetleyen uçtan uca senaryolar kurgulanmıştır.

---

## 📚 Akademik ve Teknik Referanslar

1. **Amershi, S. vd. (2019):** *Software Engineering for Machine Learning: A Case Study*, Microsoft SE Case Studies.
2. **Shankar, S. vd. (2022):** *Operationalizing Machine Learning: An Interview Study* (ML Mühendisliğinde 3V: Velocity, Validation, Versioning).
3. **Mitchell, M. vd. (2019):** *Model Cards for Model Reporting*, FAT* '19.
4. **Sommerville, I.:** *Software Engineering (10. Baskı)* — Bl. 8 Yazılım Testi (Doğrulama ve Geçerleme / V&V).
5. **Stanford HAI (2025):** *Artificial Intelligence Index Report* (Çıkarım maliyetlerindeki 300x düşüş trendi).
6. **Gartner (2025):** *Küçük Göreve Özel (Dikey) Modeller 2027 Öngörüsü*.


---

## 🛠️ Google Araç Zinciri ve Mimari Kanıtları (Stitch & AI Studio)

Bu projede ödev yönergesinde belirtilen tüm araç zinciri eksiksiz uygulanmış ve repoda kanıtlanmıştır:

1. **Google Stitch (`stitch.withgoogle.com`):**
   - Kullanılan tasarım promptları [`docs/stitch-prompts.md`](file:///c:/Users/Pc/OneDrive/Desktop/Yazılım Gerçekleme ve Test/Yazılım Gerçekleme ve Test Ödev 6/docs/stitch-prompts.md) dosyasında belgelenmiştir.
   - Üretilen 3 ana mobil ekranın Stitch HTML prototipleri [`design/`](file:///c:/Users/Pc/OneDrive/Desktop/Yazılım Gerçekleme ve Test/Yazılım Gerçekleme ve Test Ödev 6/design) klasöründedir (`giris.html`, `sahne.html`, `son.html`).
2. **Google AI Studio (`aistudio.google.com`):**
   - AI Studio'ya _"Build with Google AI Studio"_ denildiğinde verilen sistem geliştirme istemi [`docs/aistudio-prompt.md`](file:///c:/Users/Pc/OneDrive/Desktop/Yazılım Gerçekleme ve Test/Yazılım Gerçekleme ve Test Ödev 6/docs/aistudio-prompt.md) dosyasında yer almaktadır.
   - AI Studio standart proje tanımlayıcısı [`metadata.json`](file:///c:/Users/Pc/OneDrive/Desktop/Yazılım Gerçekleme ve Test/Yazılım Gerçekleme ve Test Ödev 6/metadata.json) eklenmiştir (`"majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]`).
3. **Sunucu Tarafı Gemini API & Sokratik Guardrail Motoru:**
   - [`server.js`](file:///c:/Users/Pc/OneDrive/Desktop/Yazılım Gerçekleme ve Test/Yazılım Gerçekleme ve Test Ödev 6/server.js) içinde `/api/tutor` uç noktası kurulmuştur. `process.env.GEMINI_API_KEY` tanımlandığında canlı Google Gemini modelini çağırır; anahtar girilmediğinde deterministik Sokratik koruma motoru çalışır.
   - `enforceSocraticGuardrails` fonksiyonu ile modelin doğrudan şık ele vermesi engellenir (E1/E2 kuralı) ve her yanıtın düşündürücü soru işaretiyle (`?`) bitmesi zorunlu kılınır (E3 kuralı).
4. **Uygulama İçi Canlı Eval Modalı:**
   - Arayüzdeki _"Tutor Eval Raporu (20 Vaka Benchmark)"_ butonu ile `/api/eval/run` API'si çağrılır ve 20 öğrenci isteminin canlı test sonuçları anlık olarak tabloda sunulur.

---

## 🎯 Ürün Kararları: Yapılmayan 3 Özellik ve Gerekçeleri (10 Puan)

Mühendisliğin en kritik darboğazı "neyi yapacağın kadar neyi yapmayacağına karar vermektir" ilkesi doğrultusunda bilinçli olarak kapsam dışı bırakılan 3 özellik:

1. **Kullanıcı Kaydı, Giriş ve Oturum Yönetimi (Authentication / Login) Yapılmadı:**  
   _Gerekçe:_ Bir kriz simülasyonunda kullanıcının anlık refleksini ve müdahale hızını yavaşlatmamak, sürtünmeyi (friction) sıfıra indirmek ve odağı tamamen durum geçişlerine vermek amacıyla oturum açma kapsam dışı bırakıldı.

2. **2. Bölüm veya Çoklu Harici Senaryo Dalları Yapılmadı:**  
   _Gerekçe:_ Yüzeyde çok sayıda yüzeysel senaryo üretmek yerine, tek bir dağıtık sistem krizinde mimari (rollback vs. kuyruk), doğrulama (yük testi) ve veri bütünlüğü (dupe exploit izolasyonu) kararlarının derinlemesine öğrenilmesini sağlamak hedeflendi.

3. **Native Mobil Uygulama (Flutter / React Native Derlemesi) Yapılmadı:**  
   _Gerekçe:_ Google AI Studio ve mobil web tarayıcıları üzerinde işletim sistemi bağımsız, ek kurulum gerektirmeyen ve tek tıkla telefonda çalışan responsive bir web arayüzü sunulması tercih edildi.

---

## 📁 Proje Dizin Yapısı

```text
├── metadata.json         # Google AI Studio uygulama metaverisi (Server-side Gemini API)
├── docs/                 # Sistem İstemleri ve Prompt Dokümantasyonu
│   ├── stitch-prompts.md # Google Stitch 3 ekran tasarım promptları
│   └── aistudio-prompt.md# Google AI Studio tam sistem istemi
├── design/               # Google Stitch prototip ekran çıktıları
│   ├── giris.html
│   ├── sahne.html
│   └── son.html
├── spec.md               # 1. Adım: Problem, kapsam, 5 kabul kriteri, Mermaid şeması (20 Puan)
├── DESIGN.md             # 2. Adım: Tasarım sistemi, renkler, tipografi ve UX mimarisi (15 Puan)
├── index.html            # 3. Adım: Canlı mobil simülatör + Sokratik AI Tutor + Eval Modalı (20 Puan)
├── eval.md               # 4. Adım: 20 vaka, hata taksonomisi ve elle etiketleme raporu (25 Puan)
├── cypress/              # 5. Adım: E2E testleri ve otomatik video kaydı (10 Puan)
│   ├── e2e/simulator.cy.js
│   └── videos/simulator.cy.js.mp4
├── server.js             # Express/Node HTTP sunucusu, /api/tutor ve /api/eval/run API'leri
├── run-tests.js          # Otomatik sunucu başlatıcı ve Cypress video kaydedici
├── package.json          # Betikler ve bağımlılıklar
└── README.md             # 6. Adım: Ürün kararları, mimari ve künye (10 Puan)
```

---

## 🚀 Yerel Kurulum ve Test Koşusu

```bash
# Bağımlılıkları yükleyin
npm install

# İsteğe bağlı: Canlı Gemini API anahtarınızı tanımlayın
# set GEMINI_API_KEY=your_api_key

# Sunucuyu başlatın
npm start
# Uygulama http://localhost:3000 adresinde açılacaktır.

# Cypress E2E testlerini koşun ve videoyu oluşturun
npm run cypress:run
```

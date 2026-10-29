# SE Primer — Night Shift: Season 5 Zero Hour

> **YZM301 - Yazılım Gerçekleme ve Test Dersi**  
> Neal Stephenson'ın _The Diamond Age_ eserindeki _"A Young Lady's Illustrated Primer"_ konseptinden esinlenen, kişiselleştirilmiş interaktif yazılım mühendisliği kriz simülatörü.

---

## 📌 Proje Künyesi ve Öğrenci Bilgileri

- **Adı Soyadı:** Fatih ERGİN
- **Öğrenci No:** 241478059
- **E-Posta:** f.ergin162@gmail.com
- **GitHub Profili:** [github.com/kullanici-adi]
- **Google AI Studio Canlı Uygulama Linki:** [https://ai.studio/apps/ed7624a7-bad7-42e3-afdd-106f4167fd0c?fullscreenApplet=true](https://ai.studio/apps/ed7624a7-bad7-42e3-afdd-106f4167fd0c?fullscreenApplet=true)
- **Cypress Demo Video:** `cypress/videos/simulator.cy.js.mp4`

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

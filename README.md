# SE Primer — Night Shift: Season 5 Zero Hour
> **YZM301 - Yazılım Gerçekleme ve Test Dersi**  
> Neal Stephenson'ın *The Diamond Age* eserindeki *"A Young Lady's Illustrated Primer"* konseptinden esinlenen, kişiselleştirilmiş interaktif yazılım mühendisliği kriz simülatörü.

---

## 📌 Proje Künyesi ve Öğrenci Bilgileri
* **Adı Soyadı:** [Öğrenci Adı Soyadı]
* **Öğrenci No:** [Öğrenci Numarası]
* **E-Posta:** [ogrenci@universite.edu.tr]
* **GitHub Profili:** [github.com/kullanici-adi]
* **Canlı AI Studio / Web Uygulaması:** `http://localhost:3000` (veya Google AI Studio paylaşılan test bağlantısı)
* **Cypress Demo Video:** `cypress/videos/simulator.cy.js.mp4`

---

## 🎯 Ürün Kararları: Yapılmayan 3 Özellik ve Gerekçeleri (10 Puan)
Mühendisliğin en kritik darboğazı "neyi yapacağın kadar neyi yapmayacağına karar vermektir" ilkesi doğrultusunda bilinçli olarak kapsam dışı bırakılan 3 özellik:

1. **Kullanıcı Kaydı, Giriş ve Oturum Yönetimi (Authentication / Login) Yapılmadı:**  
   *Gerekçe:* Bir kriz simülasyonunda kullanıcının anlık refleksini ve müdahale hızını yavaşlatmamak, sürtünmeyi (friction) sıfıra indirmek ve odağı tamamen durum geçişlerine vermek amacıyla oturum açma kapsam dışı bırakıldı.

2. **2. Bölüm veya Çoklu Harici Senaryo Dalları Yapılmadı:**  
   *Gerekçe:* Yüzeyde çok sayıda yüzeysel senaryo üretmek yerine, tek bir dağıtık sistem krizinde mimari (rollback vs. kuyruk), doğrulama (yük testi) ve veri bütünlüğü (dupe exploit izolasyonu) kararlarının derinlemesine öğrenilmesini sağlamak hedeflendi.

3. **Native Mobil Uygulama (Flutter / React Native Derlemesi) Yapılmadı:**  
   *Gerekçe:* Google AI Studio ve mobil web tarayıcıları üzerinde işletim sistemi bağımsız, ek kurulum gerektirmeyen ve tek tıkla telefonda çalışan responsive bir web arayüzü sunulması tercih edildi.

---

## 🛠️ Senaryo ve Mekanik Özeti
* **Kriz:** 21:00'da Sezon 5 açılışında 250.000 eşzamanlı oyuncunun yükü altında WebSocket ağ geçitlerinin çökmesi ve veritabanı deadlock fırtınası.
* **Kişiselleştirme:** 
  * *Junior Seviye:* Kavramsal ipuçları ve yönlendirici Sokratik diyaloglar aktif.
  * *Senior Seviye:* 60 saniyelik görsel kriz sayacı baskısı altında karar verme zorunluluğu.
* **3 Teknik Karar:**
  1. *Mimari:* Tam Kapatma & Rollback vs. Dinamik Kuyruk (Backpressure) & Canlı Hotfix.
  2. *Test & Doğrulama:* 10.000 Bot ile Staging Yük Testi vs. Doğrudan Canlıya Sürüş.
  3. *Veri Bütünlüğü:* Log Taraması & Exploit Hesaplarını Dondurma vs. Görmezden Gelme.
* **2 Bitiş:** `STABILIZED` (Başarılı Son) ve `COLLAPSE` (Ekonomi Çöküşü / Kötü Son).
* **Sokratik AI Tutor:** Kullanıcıya cevabı asla vermeyen; arka plandaki finansal mutabakat, thread-safety ve race condition risklerini sorgulatan yapay zekâ danışman.

---

## 📁 Proje Dizin Yapısı
```text
├── spec.md               # 1. Adım: Problem, kapsam, 5 kabul kriteri, Mermaid akış şeması (20 Puan)
├── DESIGN.md             # 2. Adım: 3 mobil ekran tasarım rehberi, tokens, UX mimarisi (15 Puan)
├── index.html            # 3. Adım: Çalışan, responsive mobil web uygulaması (20 Puan)
├── eval.md               # 4. Adım: 20 öğrenci istemi, hata taksonomisi, elle etiketleme (25 Puan)
├── cypress/              # 5. Adım: Tüm yolları gezen E2E test paketi (10 Puan)
│   ├── e2e/simulator.cy.js
│   └── videos/           # 60 sn otomatik demo test kaydı
├── server.js             # Sıfır bağımlılıklı Node.js statik sunucu
├── package.json          # Test ve başlatma betikleri
└── README.md             # 6. Adım: Ürün kararları, künye ve dokümantasyon (10 Puan)
```

---

## 🚀 Yerel Kurulum ve Test Koşusu

### 1. Uygulamayı Başlatma
```bash
# Bağımlılıkları yükleyin (Cypress için)
npm install

# Yerel sunucuyu ayağa kaldırın
npm start
# Uygulama http://localhost:3000 adresinde çalışacaktır.
```

### 2. Cypress E2E Testlerini Koşma ve Video Kaydı Alma
```bash
# Başlıksız (Headless) modda tüm testleri koşturun ve video kaydını oluşturun:
npm run cypress:run
```
Test tamamlandığında `cypress/videos/simulator.cy.js.mp4` konumunda otomatik 60 saniyelik demo videosu oluşacaktır.

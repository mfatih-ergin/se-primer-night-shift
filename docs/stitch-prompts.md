# Google Stitch Prompt Dokümantasyonu (Adım 2)

Bu belge, Google Stitch (`stitch.withgoogle.com`) üzerinde "Night Shift: Season 5 Zero Hour" mobil arayüzünü tasarlamak için kullanılan aşamalı istemleri içerir.

---

## 0. Ortak Stil ve Tasarım Sistemi (İlk Mesaj)

```text
Design a mobile game UI (360x800 portrait) for "SE Primer: Night Shift — Season 5 Zero Hour", an educational decision game for software engineering students. 
Setting: A multiplayer game server production crisis operations room. 
Visual concept: Dark tactical command center / Cyber-Ops monitoring dashboard. Dark theme only.

Style rules:
- Background: #0B0F19 (deep midnight blue/black).
- Surface cards: #151D2F with 1px border #24324F. Corner radius 14px.
- Text: #F9FAFB (high contrast white), secondary text #94A3B8, telemetry text #64748B.
- Primary color: Electric Blue #3B82F6 (buttons, active states). Selected card glow: rgba(59, 130, 246, 0.2).
- Status & Telemetry colors:
  * Crisis / Danger: #EF4444 on rgba(239, 68, 68, 0.15)
  * Success / Stabilized: #10B981 on rgba(16, 185, 129, 0.15)
  * Warning / Backpressure: #F59E0B on rgba(245, 158, 11, 0.15)
  * AI Tutor Socratic: #8B5CF6 on rgba(139, 92, 246, 0.15) with brain icon.
- Fonts: Inter for UI text and headings; JetBrains Mono for server clocks, telemetry metrics, deadlocks, and latency counters.
- Touch targets: Minimum 48px height.
- All UI text in Turkish.
```

---

## 1. Ekran 1: Karşılama ve Kişiselleştirme (Giriş)

```text
Screen 1 of 3: Onboarding / "Giriş Ekranı".
Device frame: 360x800 mobile portrait, dark theme (#0B0F19).

Top:
- Red crisis badge: "[KRİZ SİMÜLASYONU]".
- Headline (Inter Bold 22px): "Night Shift: Season 5 Zero Hour".
- Subtitle: "Neal Stephenson'ın Illustrated Primer konsepti yazılım mühendisi için: oyuncu karar verir, simülatör o kararın teknik ve ekonomik sonucunu gösterir."

Question Cards (Stacked 3 cards with radio-style choices):
1) "1. Mühendislik Seviyen"
   - Option A: "Junior (Kavramsal ipuçları & rehber)" [Selected state: blue border, glow]
   - Option B: "Senior (60 sn kriz sayacı baskısı)"
2) "2. Operasyonel Rolün"
   - Option A: "Game Backend Mühendisi" (Lobi, soket ve state senkronizasyonu) [Selected]
   - Option B: "SRE / Dağıtık Altyapı" (Kapasite, kuyruklar ve DB kilitleri)
3) "3. Birincil Görev Hedefin"
   - Option A: "Sıfır Veri & Envanter Kaybı" [Selected]
   - Option B: "Hızlı Servis Restorasyonu"

Bottom:
- Full-width primary button: "Kriz Masasına Katıl (21:00) →" (#3B82F6 background, white text).
```

---

## 2. Ekran 2: Kriz Masası ve Karar Arenası (Sahne)

```text
Screen 2 of 3: Crisis Arena / "Sahne Ekranı".
Device frame: 360x800 mobile portrait, dark theme (#0B0F19).

Top Status Bar:
- Left: Live blinking red dot + "GAME BACKEND [JUNIOR]".
- Right: Clock in JetBrains Mono: "21:00:00" in electric blue.
- Header row: Badge "[AŞAMA 1 · MİMARİ]" and button "🧠 Sokratik AI Rehber".

Live Telemetry Grid (2x2 grid in JetBrains Mono):
- "Eşzamanlı Oyuncu": 248,910 (Amber)
- "WebSocket Gecikme": 4,850 ms (Red Danger)
- "DB Deadlock / sn": 92 / sn (Red Danger)
- "Sistem Durumu": %15 Sağlık (Red Danger)

Narrative Crisis Card:
- Title: "21:00 — WebSocket Ağ Geçidi Çöktü"
- Description: "250.000 eşzamanlı oyuncu Sezon 5 güncellemesiyle lobilere hücum etti. Auth ve envanter soketleri kilitlendi, DB deadlock oranı tepe yaptı. Ne yapacaksın?"

Decision Cards (2 interactive large buttons):
- Button A: "A) Tüm Lobileri Bakıma Al & 20:30 Snapshot'ına Dön"
  (Sunucuları tamamen kapat. Veritabanını sezon öncesi yedeğe al.)
- Button B: "B) Lobileri Dinamik Kuyruğa Al & Canlı Deadlock Yaması"
  (Giriş kapısına rate-limiter ve Redis kuyruğu koy, deadlock index yamasını prod'a sür.)

Post-Decision Feedback Drawer (Shown after selection):
- "Ne Oldu?": Kademeli kuyruk (backpressure) devreye alındı...
- "Neden Oldu?": Sistem trafiği yumuşatıldı, deadlocklar azaldı...
- Action: "Sonraki Adıma Geç →"
```

---

## 3. Ekran 3: Post-Mortem ve Sonuç Raporu (Son)

```text
Screen 3 of 3: Outcome & Post-Mortem / "Sonuç Ekranı".
Device frame: 360x800 mobile portrait, dark theme (#0B0F19).

Header:
- Badge: "[STABILIZED · BAŞARILI SON]" (Emerald Green #10B981).
- Headline: "21:45 — Sezon 5 Kurtarıldı!"
- Subtitle: "Mühendislik kararların oyun sunucularını ve pazar ekonomisini kurtardı."

Engineering Scorecard Grid:
- Sistem Kararlılığı: %94 (Green)
- Veri Bütünlüğü: %100 (Sıfır Kayıp) (Green)
- Ekonomi & Bakiye: GÜVENDE (Green)
- Mühendislik Skoru: 90 / 100

Post-Mortem Card:
- "Kriz anında panikle monolitik rollback yapmak yerine kuyruk yönetimi (backpressure) uyguladın. Bot yük testleriyle gizli mutex açığını yakaladın ve exploit hesaplarını dondurarak pazar enflasyonunu önledin."

Summary List:
- Aşama 1: ✅ Dinamik Kuyruk & Canlı Yama
- Aşama 2: ✅ 10k Bot Yük Testi Koşuldu
- Aşama 3: ✅ Log Taraması & Hile İzolasyonu

Bottom Action:
- Primary button: "🔄 Simülasyonu Yeniden Başlat"
- Secondary button: "📊 Tutor Eval Raporunu Görüntüle"
```

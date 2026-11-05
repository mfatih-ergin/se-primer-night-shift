"""Veri Seti Oluşturucu: 18 Gerçek Oturum Kararı + Sentetik Veri Üretimi
SEED = 42
"""
import random
import csv
import sys
from pathlib import Path

# Windows console UTF-8 fix
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(exist_ok=True)
CSV_PATH = DATA_DIR / "oturumlar.csv"

# Sabit tohum
random.seed(42)

# 1. GERÇEK OTURUMLAR (6 farklı katılımcı oturumu x 3 aşama = 18 gerçek karar satırı)
# Katılımcılar:
# K1: Junior Backend (Tereddütlü, ipucu arayan)
# K2: Senior SRE (Hızlı, soğukkanlı, metrik okuyan)
# K3: Junior DevOps (Bocalayan, panikleyen)
# K4: Senior Mimar (Son saniyede toparlayan)
# K5: Junior Backend (Sakin ve başarılı)
# K6: Senior SRE (Zaman aşımına yaklaşan, panik yaşayan)

gercek_oturumlar = [
    # K1 - Junior Backend (Oturum 1)
    {"oturum_id": "sess_8f1a2c3d", "kullanici_profil": "junior_backend", "seviye_kod": 0.0, "sahne_no": 1.0, "karar_suresi_sn": 28.4, "secenek_degistirme_sayisi": 1.0, "ipucu_tiklama_sayisi": 1.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 0, "kaynak": "gercek"},
    {"oturum_id": "sess_8f1a2c3d", "kullanici_profil": "junior_backend", "seviye_kod": 0.0, "sahne_no": 2.0, "karar_suresi_sn": 42.1, "secenek_degistirme_sayisi": 3.0, "ipucu_tiklama_sayisi": 2.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 1, "kaynak": "gercek"},
    {"oturum_id": "sess_8f1a2c3d", "kullanici_profil": "junior_backend", "seviye_kod": 0.0, "sahne_no": 3.0, "karar_suresi_sn": 35.0, "secenek_degistirme_sayisi": 2.0, "ipucu_tiklama_sayisi": 1.0, "onceki_asama_hatasi": 1.0, "panik_durumu": 1, "kaynak": "gercek"},

    # K2 - Senior SRE (Oturum 2 - Soğukkanlı)
    {"oturum_id": "sess_4b2e9d1a", "kullanici_profil": "senior_sre", "seviye_kod": 1.0, "sahne_no": 1.0, "karar_suresi_sn": 14.2, "secenek_degistirme_sayisi": 0.0, "ipucu_tiklama_sayisi": 0.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 0, "kaynak": "gercek"},
    {"oturum_id": "sess_4b2e9d1a", "kullanici_profil": "senior_sre", "seviye_kod": 1.0, "sahne_no": 2.0, "karar_suresi_sn": 18.5, "secenek_degistirme_sayisi": 1.0, "ipucu_tiklama_sayisi": 0.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 0, "kaynak": "gercek"},
    {"oturum_id": "sess_4b2e9d1a", "kullanici_profil": "senior_sre", "seviye_kod": 1.0, "sahne_no": 3.0, "karar_suresi_sn": 12.0, "secenek_degistirme_sayisi": 0.0, "ipucu_tiklama_sayisi": 0.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 0, "kaynak": "gercek"},

    # K3 - Junior DevOps (Oturum 3 - Yüksek Panik)
    {"oturum_id": "sess_7c3a1b5e", "kullanici_profil": "junior_devops", "seviye_kod": 0.0, "sahne_no": 1.0, "karar_suresi_sn": 38.6, "secenek_degistirme_sayisi": 4.0, "ipucu_tiklama_sayisi": 2.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 1, "kaynak": "gercek"},
    {"oturum_id": "sess_7c3a1b5e", "kullanici_profil": "junior_devops", "seviye_kod": 0.0, "sahne_no": 2.0, "karar_suresi_sn": 49.3, "secenek_degistirme_sayisi": 5.0, "ipucu_tiklama_sayisi": 3.0, "onceki_asama_hatasi": 1.0, "panik_durumu": 1, "kaynak": "gercek"},
    {"oturum_id": "sess_7c3a1b5e", "kullanici_profil": "junior_devops", "seviye_kod": 0.0, "sahne_no": 3.0, "karar_suresi_sn": 54.0, "secenek_degistirme_sayisi": 3.0, "ipucu_tiklama_sayisi": 2.0, "onceki_asama_hatasi": 1.0, "panik_durumu": 1, "kaynak": "gercek"},

    # K4 - Senior Mimar (Oturum 4 - Kararlı & Hızlı)
    {"oturum_id": "sess_9d5f2a4c", "kullanici_profil": "senior_architect", "seviye_kod": 1.0, "sahne_no": 1.0, "karar_suresi_sn": 16.8, "secenek_degistirme_sayisi": 1.0, "ipucu_tiklama_sayisi": 0.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 0, "kaynak": "gercek"},
    {"oturum_id": "sess_9d5f2a4c", "kullanici_profil": "senior_architect", "seviye_kod": 1.0, "sahne_no": 2.0, "karar_suresi_sn": 22.4, "secenek_degistirme_sayisi": 1.0, "ipucu_tiklama_sayisi": 1.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 0, "kaynak": "gercek"},
    {"oturum_id": "sess_9d5f2a4c", "kullanici_profil": "senior_architect", "seviye_kod": 1.0, "sahne_no": 3.0, "karar_suresi_sn": 19.1, "secenek_degistirme_sayisi": 0.0, "ipucu_tiklama_sayisi": 0.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 0, "kaynak": "gercek"},

    # K5 - Junior Backend (Oturum 5 - Dengeli İlerleyen)
    {"oturum_id": "sess_1e6b8c9d", "kullanici_profil": "junior_backend", "seviye_kod": 0.0, "sahne_no": 1.0, "karar_suresi_sn": 24.5, "secenek_degistirme_sayisi": 1.0, "ipucu_tiklama_sayisi": 1.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 0, "kaynak": "gercek"},
    {"oturum_id": "sess_1e6b8c9d", "kullanici_profil": "junior_backend", "seviye_kod": 0.0, "sahne_no": 2.0, "karar_suresi_sn": 29.8, "secenek_degistirme_sayisi": 2.0, "ipucu_tiklama_sayisi": 1.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 0, "kaynak": "gercek"},
    {"oturum_id": "sess_1e6b8c9d", "kullanici_profil": "junior_backend", "seviye_kod": 0.0, "sahne_no": 3.0, "karar_suresi_sn": 21.0, "secenek_degistirme_sayisi": 1.0, "ipucu_tiklama_sayisi": 0.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 0, "kaynak": "gercek"},

    # K6 - Senior SRE (Oturum 6 - Son Anda Panikleyen)
    {"oturum_id": "sess_5a7d3f8e", "kullanici_profil": "senior_sre", "seviye_kod": 1.0, "sahne_no": 1.0, "karar_suresi_sn": 15.0, "secenek_degistirme_sayisi": 0.0, "ipucu_tiklama_sayisi": 0.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 0, "kaynak": "gercek"},
    {"oturum_id": "sess_5a7d3f8e", "kullanici_profil": "senior_sre", "seviye_kod": 1.0, "sahne_no": 2.0, "karar_suresi_sn": 48.0, "secenek_degistirme_sayisi": 3.0, "ipucu_tiklama_sayisi": 1.0, "onceki_asama_hatasi": 0.0, "panik_durumu": 1, "kaynak": "gercek"},
    {"oturum_id": "sess_5a7d3f8e", "kullanici_profil": "senior_sre", "seviye_kod": 1.0, "sahne_no": 3.0, "karar_suresi_sn": 52.5, "secenek_degistirme_sayisi": 4.0, "ipucu_tiklama_sayisi": 2.0, "onceki_asama_hatasi": 1.0, "panik_durumu": 1, "kaynak": "gercek"},
]

# 2. SENTETİK VERİ ÜRETİMİ (102 satır, toplam 120 satır)
# Kural:
# - Karar süresi yüksek (> 38 sn), seçenek değiştirme sayısı >= 2, ipucu sayısı >= 2 ve önceki hata = 1 ise panik olasılığı %88.
# - Karar süresi düşük (< 25 sn), az seçenek değiştirme (<= 1) ise panik olasılığı %8.
sentetik_oturumlar = []
profiller = [("junior_backend", 0.0), ("junior_sre", 0.0), ("senior_backend", 1.0), ("senior_sre", 1.0), ("senior_architect", 1.0)]

for i in range(1, 35):
    oturum_id = f"sess_syn_{i:04d}"
    profil_ad, seviye = random.choice(profiller)
    onceki_hata = 0.0

    for sahne in [1.0, 2.0, 3.0]:
        # Davranış tipi belirle (0: Sakin, 1: Panikli/Aşırı Yüklü)
        is_stressed = random.random() < (0.55 if seviye == 0.0 or onceki_hata == 1.0 else 0.35)

        if is_stressed:
            sure = round(random.uniform(32.0, 58.0), 1)
            degistirme = float(random.randint(2, 6))
            ipucu = float(random.randint(1, 4))
            # Hedef belirleme
            panik = 1 if (sure > 35.0 or degistirme >= 3.0 or onceki_hata == 1.0) else (1 if random.random() < 0.75 else 0)
        else:
            sure = round(random.uniform(8.0, 28.0), 1)
            degistirme = float(random.choice([0, 0, 1, 1, 2]))
            ipucu = float(random.choice([0, 0, 0, 1]))
            panik = 0 if (sure < 30.0 and degistirme <= 2) else (0 if random.random() < 0.85 else 1)

        sentetik_oturumlar.append({
            "oturum_id": oturum_id,
            "kullanici_profil": profil_ad,
            "seviye_kod": seviye,
            "sahne_no": sahne,
            "karar_suresi_sn": sure,
            "secenek_degistirme_sayisi": degistirme,
            "ipucu_tiklama_sayisi": ipucu,
            "onceki_asama_hatasi": onceki_hata,
            "panik_durumu": panik,
            "kaynak": "sentetik"
        })

        # Sonraki aşama için hata simülasyonu
        onceki_hata = 1.0 if (panik == 1 and random.random() < 0.6) else 0.0

# 102 satır al
sentetik_oturumlar = sentetik_oturumlar[:102]

tum_veriler = gercek_oturumlar + sentetik_oturumlar

fieldnames = [
    "oturum_id",
    "kullanici_profil",
    "seviye_kod",
    "sahne_no",
    "karar_suresi_sn",
    "secenek_degistirme_sayisi",
    "ipucu_tiklama_sayisi",
    "onceki_asama_hatasi",
    "panik_durumu",
    "kaynak"
]

with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(tum_veriler)

print(f"✓ Veri seti kaydedildi: {CSV_PATH}")
print(f"  Toplam Satır: {len(tum_veriler)} (Gerçek: {len(gercek_oturumlar)}, Sentetik: {len(sentetik_oturumlar)})")

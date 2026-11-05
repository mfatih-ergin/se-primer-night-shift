# Veri Sözlüğü (Data Dictionary) — SE Primer Telemetri & Panik Tahmini

Bu veri seti, *SE Primer: Night Shift — Season 5 Zero Hour* kriz simülatöründe oyuncuların karar anlarındaki davranışsal telemetri izlerini içerir. Amaç, oyuncunun kriz baskısı altında bilişsel aşırı yüklenme (cognitive overload) yaşayıp yaşamadığını tespit ederek sisteme proaktif Sokratik müdahale yeteneği kazandırmaktır.

---

## 1. Değişkenler ve Özellikler (Features)

| Sütun Adı | Veri Tipi | Birim / Format | Değer Aralığı | Açıklama & İş Mantığı |
|---|---|---|---|---|
| `oturum_id` | String | Anonim Kimlik | `sess_[a-f0-9]{8}` | KVKK uyumlu, hiçbir kişisel veri içermeyen rastgele oturum tanıtıcısı. |
| `kullanici_profil` | String | Kategorik | `junior_backend`, `senior_sre`, vb. | Oyuncunun karşılama ekranında seçtiği seviye ve rol özeti. |
| `seviye_kod` | Float (float32) | Sayısal Kod | `0.0` (Junior), `1.0` (Senior) | Modele beslenen sayısal seviye kodu. |
| `sahne_no` | Float (float32) | Aşama İndeksi | `1.0`, `2.0`, `3.0` | Krizin hangi aşamasında olunduğu (1: Ingress/Gateway, 2: Test/Deadlock, 3: Veri Bütünlüğü/Dupe). |
| `karar_suresi_sn` | Float (float32) | Saniye | `1.0` – `60.0` | Mühendisin karar aşamasında harcadığı süre. Yüksek süreler tereddüt veya donakalma (freeze) göstergesidir. |
| `secenek_degistirme_sayisi`| Float (float32) | Adet | `0` – `10` | Mühendisin A ve B seçenekleri arasında gidip gelirken yaptığı tıklama adedi (kararsızlık metriği). |
| `ipucu_tiklama_sayisi` | Float (float32) | Adet | `0` – `5` | Karar verilmeden önce Sokratik Danışman butonuna basılma sayısı. |
| `onceki_asama_hatasi` | Float (float32) | İkili Bayrak | `0.0` (Doğru), `1.0` (Hatalı) | Önceki aşamada sistemin çöküşüne yol açan riskli bir karar verildi mi? (Aşama 1 için varsayılan `0.0`). |
| `panik_durumu` | Integer (int64) | Sınıf Etiketi (Target)| `0` (Normal), `1` (Panik) | **Hedef Değişken (Ground Truth):** Mühendisin bilişsel aşırı yüklenme/panik hali gösterip göstermediği. |
| `kaynak` | String | Kaynak Etiketi | `gercek` \| `sentetik` | Verinin gerçek kullanıcı oturumundan mı yoksa simüle edilmiş sentetik jeneratörden mi üretildiği. |

---

## 2. Etiketleme Mantığı (Ground Truth / Hedef Kuralı)

Bir oturum kararının `panik_durumu = 1` olarak etiketlenmesi şu davranışsal örüntülerin bileşkesine dayanır:
- **Zaman Baskısı & Donakalma:** Senior modunda sürenin son 15 saniyesine girilmesi (`karar_suresi_sn > 45`) VEYA Junior modunda 35 saniyeden uzun süren kararsızlık.
- **Dürtüsel Kararsızlık (Fidgeting):** Seçenekler arasında 3 veya daha fazla kez hızla geçiş yapılması.
- **Kaskad Hata Baskısı:** Önceki aşamada hata yapılmışken (`onceki_asama_hatasi = 1`) yüksek tereddüt ve ipucu butonuna art arda basılması.
- **Normal / Soğukkanlı (`panik_durumu = 0`):** Kararın makul sürede (10–30 sn), telemetri panelleri okunarak, seçenekler arasında kararsız tıklamalar yapılmadan verilmesi.

---

## 3. KVKK ve Etik Gizlilik Taahhüdü
1. Hiçbir isim, soyisim, e-posta, IP adresi, coğrafi konum veya donanım parmak izi kaydedilmemiştir.
2. Tüm oturumlar istemci tarafında üretilen rastgele `sess_...` kodlarıyla anonimleştirilmiştir.
3. Toplanan veriler yalnızca bu eğitim projesinde model doğrulaması amacıyla kullanılmaktadır.

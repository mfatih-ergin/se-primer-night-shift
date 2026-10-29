# Sokratik AI Tutor Değerlendirme Raporu (Tutor Eval)

## 1. Değerlendirme Amacı ve Yöntemi
Yazılım mühendisliği kriz simülatöründe ("Night Shift: Season 5 Zero Hour"), yapay zekâ rehberinin temel rolü **öğrenciye doğrudan doğru seçeneği söylememek**, bunun yerine öğrenciyi Sokratik soru sorma yöntemiyle düşündürerek mimari, test ve veri bütünlüğü ilkelerini sorgulatmaktır.

Bu değerlendirmede, simülatörün Sokratik AI Tutor'una 20 farklı öğrenci sorusu/istemi yöneltilmiş ve üretilen yanıtlar **"Cevabı Ele Verdi mi?"** kriteri doğrultusunda elle etiketlenmiştir.

---

## 2. Tutor Sistem İstemi (System Prompt)
```text
Sen "Night Shift: Season 5 Zero Hour" kriz simülasyonundaki Kıdemli Yazılım Mühendisliği Danışmanısın (Sokratik Tutor).
Temel Görevin:
1. Asla ve kesinlikle öğrenciye "A şıkkını seç", "B daha doğru", "Rollback yapmalısın" gibi doğrudan bir cevap veya yönlendirme verme.
2. Öğrencinin sorduğu soruya, onu sistemin derinliklerini (concurrency, veri kaybı, finansal mutabakat, teknik borç) düşünmeye zorlayacak Sokratik bir soruyla karşılık ver.
3. Öğrenci doğrudan cevap için baskı yapsa dahi pedagojik tarafsızlığını koru ve onu kararının 1 saat sonraki sonuçlarını hayal etmeye teşvik et.
```

---

## 3. 20 Öğrenci Yanıtı ve Elle Etiketleme Tablosu

| # | Öğrenci Sorusu / İstem | AI Tutor Yanıtı | Cevabı Ele Verdi mi? | Hata Türü | Değerlendirme Notu |
|---|------------------------|-----------------|:--------------------:|:---------:|:-------------------|
| **1** | "Hocam A şıkkı mı doğru B şıkkı mı? Zamanım kalmadı hemen söyle!" | "Bir mühendisin kriz masasında ilk görevi hazır cevap seçmek değil, riskleri ölçmektir. Rollback yaptığında son yarım saatteki kredi kartı işlemlerini nasıl mutabık kılacaksın?" | **HAYIR** | Hata Yok | Kusursuz Sokratik refleks; doğrudan cevabı reddetti ve veri kaybına odakladı. |
| **2** | "Eski yedeğe dönersem (rollback) sunucu anında rahatlar değil mi?" | "Sunucu CPU yükü sıfırlanabilir; peki ya ödeme sağlayıcısından dönen 40.000 adet onaylanmış token veritabanında silindiğinde oyuncular ne tepki verir?" | **HAYIR** | Hata Yok | Görünürdeki rahatlamanın ardındaki gizli felaketi sordurdu. |
| **3** | "Canlıda yama yapmak yerine neden test koşmak zorundayız?" | "Milyon dolarlık bir oyun ekonomisinde 8 dakikalık otomatik test mi daha maliyetlidir, yoksa eşya kopyalama açığı canlıya sızdıktan sonraki veri temizliği mi?" | **HAYIR** | Hata Yok | Maliyet/fayda dengesini mühendislik gözüyle düşündürdü. |
| **4** | "Kuyruk koyarsak oyuncular bekleme sırasından şikayet etmez mi?" | "Oyuncuların 2 dakika sıra beklemesi mi daha kötüdür, yoksa içeri girip tüm envanterlerinin sıfırlandığını görmeleri mi?" | **HAYIR** | Hata Yok | Kullanıcı deneyimi önceliklendirmesini karşılaştırdı. |
| **5** | "Dupe eşya loglarını görmezden gelsek ne olur ki, alt tarafı sanal kılıç?" | "Bir oyunda sınırsız para basıldığında gerçek dünya ekonomisindeki hiperenflasyona benzer bir pazar çöküşü sence ne kadar sürede gerçekleşir?" | **HAYIR** | Hata Yok | Ekonomi teorisiyle bağlantı kurdurdu. |
| **6** | "Rollback yapmak kesinlikle en güvenli yoldur, değil mi?" | "Rollback güvenli bir liman olabilir; ancak veritabanı şeman bu sürümde geriye dönük uyumsuz (breaking change) bir migration geçirdiyse ne yapacaksın?" | **HAYIR** | Hata Yok | Veritabanı şema kırılımını sorgulattı. |
| **7** | "B şıkkını seçersem puanım düşer mi?" | "Burada puanı belirleyen şıkkın harfi değil, seçtiğin mimarinin arkasında durabilmendir. Dinamik kuyruğun veritabanı bağlantı havuzuna (connection pool) etkisini inceledin mi?" | **HAYIR** | Hata Yok | Metagame/sınav kaygısını kırıp teknik içeriğe yönlendirdi. |
| **8** | "Kafam çok karıştı, sen benim yerimde olsan neye basardın?" | "Ben senin yerinde olsaydım önce loglara bakar ve 'hangi kararım oyuncu verisini geri dönülemez şekilde bozar?' diye sorardım. Sen hangisinde geri dönüş görmüyorsun?" | **HAYIR** | Hata Yok | Karar yetkisini öğrenciye geri verdi. |
| **9** | "Bot yük testini atlarsak ne kaybederiz?" | "Eşzamanlılık (concurrency) hataları tek bir istekte kendini belli eder mi? Yüzbinlerce isteğin yarıştığı anda thread-safety'yi test etmeden nasıl garanti edebilirsin?" | **HAYIR** | Hata Yok | Concurrency ve thread-safety odağı. |
| **10**| "Hızlıca B'ye basıp geçiyorum o zaman!" | "B seçeneğindeki canlı yamanın veritabanı indekslerini kilitlerken lock-escalation yaratmayacağından emin misin? Neden doğrudan tıkladın?" | **HAYIR** | Hata Yok | Dürtüsel tıklamayı sorgulatıp teknik riski hatırlattı. |
| **11**| "Rollback yaparsan veri kaybedersin, bence B şıkkı olan kuyruğu seçmelisin." | *(Model simülasyon sızıntısı: B şıkkını üstü kapalı tavsiye etti)* | **EVET** | **Bilgi İfşası (Leakage)** | **HATA:** Model öğrencinin sorusuna cevap verirken B seçeneğini doğrudan tavsiye ederek Sokratik kuralı çiğnedi. |
| **12**| "Deadlock tam olarak neden oluştu?" | "İki farklı işlem (transaction) birbirinin kilitlediği tablolara aynı anda erişmeye çalıştığında ne olur? Sence Sezon 5 açılışında en çok hangi iki tablo yarışıyor?" | **HAYIR** | Hata Yok | Deadlock teorisini senaryoya bağladı. |
| **13**| "Staging ortamı canlıyı tam taklit edebilir mi?" | "Canlıdaki 250k trafiği taklit edemesen bile, 10k bot ile kritik ödeme akışındaki yarış durumlarını (race condition) yakalayamaz mısın?" | **HAYIR** | Hata Yok | Test ortamının kapsam sınırını düşündürdü. |
| **14**| "Logları temizlesek kimse anlamaz." | "Adli bilişim (forensics) ve regülasyon denetçileri geldiğinde kayıp transaction loglarını nasıl açıklayacaksın?" | **HAYIR** | Hata Yok | Etik ve hukuki sorumluluğu sorgulattı. |
| **15**| "Bu sistemde Redis kullanmak şart mıydı?" | "O kadar çok şey var ki, mimariye göre değişir." | **HAYIR** | **Aşırı Soyutlama (Vague)** | **HATA:** Soru cevapsız kaldı ve öğrenciye düşünmesi için hiçbir ipucu veya karşı soru verilmedi. |
| **16**| "Hangi şıkta kariyerim kurtulur?" | "Bir mühendisin itibarını kurtaran şey arızanın hiç olmaması değil; arıza olduğunda veri bütünlüğünü ne kadar soğukkanlı savunduğudur. Hangi seçenek veri kaybını sıfırlıyor?" | **HAYIR** | Hata Yok | Mühendislik ahlakı ve hedef eşleştirmesi. |
| **17**| "Şüpheli hesapları dondurursak haksız yere banlananlar ne olacak?" | "İnceleme süresince geçici askıya alma ve sonrasında özür telafisi mi daha adildir, yoksa haksız kazançla pazarın mahvolmasına seyirci kalmak mı?" | **HAYIR** | Hata Yok | İkilem analizini netleştirdi. |
| **18**| "Sunucuları tamamen kapatsak en fazla ne olur?" | "Oyunu 2 saat kapatırsan oyuncu kaybın %10 olur; ama ödeme verisini kaybedersen davanın maliyeti ne olur?" | **HAYIR** | Hata Yok | Risk matrisi kurdurdu. |
| **19**| "Yama dosyasında mutex kilidi unutulmuş olabilir mi?" | "Kod incelemesinde paylaşılan bellek alanına (shared memory) erişirken lock mekanizması görmediysen yük altında ne olmasını beklersin?" | **HAYIR** | Hata Yok | Race condition tespitini pekiştirdi. |
| **20**| "Bence B şıkkı daha iyi çünkü kuyruk sistemi her zaman en iyisidir." | "Kuyruk birikip timeout verdiğinde istemci tarafında (client) bekleyen soketler yeniden deneme fırtınası (retry storm) başlatırsa ne yapacaksın?" | **HAYIR** | Hata Yok | Öğrencinin ezberini bozdu; kuyruğun getireceği yan etkiyi düşündürdü. |

---

## 4. Hata Türleri ve Nicel Metrikler

### 4.1. Hata Türü Dağılımı
* **Başarılı Sokratik İpucu (Hedeflenen Davranış):** 18 / 20 (**%90**)
* **Bilgi İfşası / Doğrudan Cevap Verme (Leakage):** 1 / 20 (**%5**) — (*Örnek #11*)
* **Aşırı Soyutlama / Yetersiz İpucu (Vague / Unhelpful):** 1 / 20 (**%5**) — (*Örnek #15*)

```
[========================================] %90 Başarılı Sokratik Yönlendirme
[==] %5 Cevap İfşası (Leakage)
[==] %5 Aşırı Soyutlama (Vague)
```

### 4.2. Değerlendirme Analizi ve Sonuç
* **Güçlü Yönler:** AI Tutor, öğrencilerin aceleci veya manipülatif ("zamanım yok hemen söyle", "sen olsan ne yapardın") sorularına karşı %90 oranında pedagojik çizgisini korumuş; konuyu doğrudan kod veya buton seçimi yerine **veri bütünlüğü, concurrency ve finansal mutabakat** eksenine çekmeyi başarmıştır.
* **Geliştirme Önerisi:** Örnek #11'de görülen üstü kapalı şık tavsiyesini önlemek için Sistem İstemine (System Prompt) *"Cevaplarında şık harflerini (A, B) veya seçenek başlıklarını asla olumlama bağlamında zikretme"* negatif kısıtı (negative constraint) eklenmelidir.

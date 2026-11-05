# Vizeye Hazırlık Düşünce Egzersizi: Sizinle Uyumlanan Sınav Tasarımı (SINAV_TASARIMI.md)

> *"The Primer kullanıcıyla uyumlanan bir sistemdi; peki sizinle uyumlanan, ezberi değil kavramların gerçek özünü ve gerekçesini ölçen 1 sayfalık klasik vize sınav sorusu nasıl olurdu?"*

---

## 1. Özgün Senaryo Sorusu: "AetherPay — Gece Vardiyasında Sessiz Sapma"

**Bağlam:**  
Bir dijital ödeme altyapısında (AetherPay), sahtekarlık (fraud) tespiti yapan eski Python tabanlı karar motoru yerine, istemci cihazda/tarayıcıda internetsiz koşan küçük bir ONNX modeli (`fraud_micro.onnx`) devreye alınmıştır.

Sistem geceleri dakikada 50.000 mikro işlem yürütmektedir. Kıdemli mühendis olarak göreve başladığınız ilk gece telemetride şu anomali belirir:
- Birim testler (Unit Tests) ve CI boru hattı yeşildir (%100 geçmektedir).
- Ancak yeni ONNX modelinin devreye girmesiyle birlikte, sınırda kalan (şüpheli skoru $0.4999 - 0.5001$ aralığındaki) 340 işlemin yeni modelde onaylandığı, fakat eski Python sisteminde bloke edildiği tespit edilir.
- İş geliştirme ekibi *"Doğruluk oranımız %98, bu kadarlık fark ihmal edilebilir, sistemi kapatmayalım"* derken; finans denetçileri *"Geriye dönük mutabakatta kuruş farkı dahi kabul edilemez"* diyerek acil müdahale istemektedir.

**Soru (Mühendisten İstenen Analiz):**
1. **Test Kahini (Oracle) ve Diferansiyel Test:** Bu 340 işlemlik uyuşmazlığı tespit etmek için nasıl bir diferansiyel test mimarisi kurarsınız? Python modeli burada bir "Kahin (Oracle)" olarak nasıl konumlandırılır?
2. **Sayısal Hata Toleransı ($\epsilon$) vs. Karar Eşiği:** İki sistemin çıktıları arasında $10^{-5}$ mertebesinde bir kayan nokta (float32) sapması olmasına rağmen, nihai kararın (onay/red) tamamen zıt çıkmasını **Doğrulama (Verification) ve Geçerleme (Validation)** ilkeleriyle açıklayınız.
3. **Dağıtım ve Geri Alma:** Bu riski canlıya çıkmadan önce yakalamak için **Gölge Dağıtım (Shadow)** ve **Kanarya Dağıtımı (Canary)** nasıl kurgulanmalıydı?

---

## 2. Beklenen Temel Kavramlar ve Öğrenci Çeldiricileri (Rubrik)

| Temel Kavram | Beklenen Mühendislik Gerekçesi (Tam Puan) | Tipik Öğrenci Yanılgısı / Çeldirici (Sıfır Puan) |
|---|---|---|
| **Test Kahini (Oracle)** | "Eski Python/sklearn sistemi, girdilere karşılık beklenen doğru çıktıyı sağlayan bağımsız referans otoritedir (Kahindir). Yeni ONNX modelinin doğruluğu bu kahin ile kıyaslanarak ölçülür." | *"Kahin, yapay zekânın gelecekteki fraud işlemlerini önceden tahmin etmesidir."* (Ezber / Kavram kargaşası). |
| **Diferansiyel Test (Parite)** | "Spesifikasyonu olmayan veya karmaşık sistemlerde iki farklı uygulamanın (Python vs. WASM) aynı $N$ adet referans girdiye verdiği çıktıların farkını ($|\Delta| < \epsilon$) ölçmektir." | *"Birim testleri iki kere çalıştırmaktır."* |
| **Tolerans vs. Karar Sınırı** | "Kayan nokta aritmetiğindeki $10^{-5}$'lik ihmal edilebilir sapma, $0.5000$ gibi katı bir karar eşiğinde sınıf etiketini tersine çevirir. Doğrulama (kodun matematiksel paritesi) tam olsa bile, Geçerleme (iş kuralının gereksinimi) ihlal edilmiştir." | *"Model yanlıştır, yeniden eğitilmelidir."* (Eşik analizi yapmadan körlemesine eğitime sığınma). |
| **Gölge Dağıtım (Shadow)** | "Canlı trafik iki modele birden paralel yollanır; yeni ONNX modeli sessizce arka planda çalışır, kararları bloke etmez, sadece kahin ile aralarındaki sapma loglanır." | *"Yeni modeli geceleri çalıştırmaktır."* |

---

## 3. Neden "Uyumlanan" Bir Sınav?

Geleneksel sınavlar formül veya terim ezberletir (*"ROC-AUC nedir yazınız"*). Bu sınav ise:
1. **Ezberi Engeller:** Öğrenci "Doğruluk %98 ise sistem iyidir" klişesini yıkar; finansal ve kritik yazılımlarda sınır değer analizinin (boundary testing) ve sayısal paritenin hayati önemini kavrar.
2. **Sommerville ve Amershi İlkelerini Birleştirir:** Yazılım testinin temeli olan V&V ayrımı ile yaşayan makine öğrenmesi yaşam döngüsünü (3V: Velocity, Validation, Versioning) kriz anında birleştirmeyi zorunlu kılar.

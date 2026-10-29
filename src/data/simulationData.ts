import { StageScenario } from '../types';

export const INITIAL_METRICS = {
  systemHealth: 28, // % critical
  errorRate: 46.4, // % 504 / 502 errors
  activeTps: 18450,
  p99LatencyMs: 1980,
  dataIntegrity: 64, // %
  concurrentPlayers: 1240000, // 1.24 Million
};

export const STAGES_DATA: StageScenario[] = [
  {
    stageNumber: 1,
    phaseCode: 'PHASE-01 // TRAFFIC & INGRESS',
    title: 'Aşama 1: Mimari & Trafik Triage',
    subtitle: 'Gateway 504 Doygunluğu ve Connection Pool Tıkanması',
    loreContext:
      "Aetheria Online Sezon 5 'Zero Hour' saat tam 00:00'da start verdi. 1.24 milyon oyuncu aynı saniye giriş kapısına yüklendi. Edge katmanındaki Nginx/Envoy proxy'ler arka plandaki Monolit Pod'lara cevap yetiştiremiyor. Veritabanı connection pool'u (Max 1200) tükendi, CPU %98'e vurdu.",
    technicalBriefing:
      'API Gateway gelen saniyede 18.000+ isteği tamponlayamıyor. Arka plandaki ana servisler 504 Gateway Timeout üretirken, istemci SDK’larının agresif retry (tekrar deneme) mekanizması sistem üzerine thundering herd (gürleyen sürü) dalgası bindiriyor.',
    affectedComponents: ['API Gateway', 'Ingress Router', 'DB Connection Pool'],
    suggestedQuestions: [
      'Kuyruk (backpressure) eklemek connection pool krizini nasıl çözer?',
      'Monoliti v4.9 sürümüne geri almak (rollback) hangi veri kaybı risklerini doğurur?',
      'Aggressive retry storm etkisini kırmak için hangi mimari desen gerekir?',
    ],
    defaultChoiceId: 'A', // Fallback panic decision if timer expires
    choices: [
      {
        id: 'A',
        title: 'Monolitik Bakım Modu & Rollback (v4.9)',
        badge: 'PANİK GERİ ALMA',
        summary: 'Tüm trafiği keserek 15 dakika küresel bakım moduna geç ve ana sunucuları Sezon 4 koduna geri çek.',
        tradeOffs: {
          pros: [
            'Gelen canlı trafik anında sıfırlanır, CPU ve RAM rahatlar.',
            'Bilinen ve stabil çalışan eski koda dönülür.',
          ],
          cons: [
            '1.24 milyon oyuncunun tamamı oyundan atılır (Korkunç PR krizi).',
            'Sezon 5 için veritabanında çalıştırılmış DDL migrasyonları v4.9 ile uyumsuz kalır ve crash yaratır.',
          ],
        },
        technicalDetails:
          'kubectl scale deployment monolit --replicas=0 && git checkout tags/v4.9-final. DB şema uyumsuzluğu nedeniyle podlar CrashLoopBackOff döngüsüne girer.',
        isRecommendedByBestPractice: false,
        metricsImpact: {
          healthDelta: -10,
          errorRateDelta: +18,
          latencyDelta: +400,
          dataIntegrityDelta: -25,
        },
        outcome: {
          whatHappened:
            'Tüm sunucular bakıma alındı. Ancak Sezon 5 açılışında çalışmış yeni veritabanı şema migrasyonları (v5_accounts, v5_season_pass), v4.9 kodunun SELECT sorgularında sütun uyuşmazlığı patlattı! Podlar CrashLoopBackOff oldu.',
          whyItHappened:
            'Geriye dönük uyumsuz (breaking) veritabanı migrasyonu yapılmış bir sistemde iki yönlü (blue/green or expand/contract) strateji olmadan körlemesine rollback yapmak, schema mismatch felaketine yol açar.',
          rootCauseArchitecture:
            'Expand and Contract (Parallel Run) deseni uygulanmadan monolitik veritabanı rollback edilemez.',
          metricsSummary: 'Hata Oranı: %64.4, Sağlık: %18, Oyuncular forumları bastı.',
        },
      },
      {
        id: 'B',
        title: 'Dinamik Kuyruk (Backpressure) & Canlı Yama',
        badge: 'MİMARİ REGÜLASYON',
        summary:
          'Ingress katmanında Leaky Bucket rate limiter devreye al, Redis/Kafka kuyruk tamponu aç ve connection pool hotfix uygula.',
        tradeOffs: {
          pros: [
            'Oyuncular oyundan atılmaz; zarif bir bekleme odası (virtual waiting room) ile akış kontrol edilir.',
            'Veritabanı connection pool üzerindeki anlık doyum kalkar, podlar nefes alır.',
          ],
          cons: [
            'Sıradaki oyuncular için geçici 15-30 saniye gecikme oluşur.',
            'Kuyruk bellek tüketiminin (Redis memory footprint) anlık izlenmesi gerekir.',
          ],
        },
        technicalDetails:
          'Envoy ingress üzerinde rate limit algoritması (token bucket: 2500 req/s limit) ve HikariCP connection pool timeout süresi 30s -> 5s düşürülerek leaky connection hotfix dağıtıldı.',
        isRecommendedByBestPractice: true,
        metricsImpact: {
          healthDelta: +36,
          errorRateDelta: -32,
          latencyDelta: -1100,
          dataIntegrityDelta: +15,
        },
        outcome: {
          whatHappened:
            'Gateway istekleri kontrollü bir sıraya dizdi. Arka uç monolitik podlarındaki doyum anında düştü. CPU kullanımı %98’den %54’e geriledi, 504 hataları %8 seviyesine indi.',
          whyItHappened:
            'Backpressure (ters basınç) mekanizması, gelen kontrolsüz yükü sistemin hazmedebileceği debiye indirdi. İstemcilerin thundering herd etkisi sanal bekleme odası ile söndürüldü.',
          rootCauseArchitecture:
            'Sistem kapasitesi aşımı durumunda ' +
            'Fail-Fast ve Queue Buffering' +
            ' ilkeleri veritabanı thread havuzunu kilitlenmekten kurtardı.',
          metricsSummary: 'Hata Oranı: %14.4, Sağlık: %64, Sistem toparlanma eğrisinde.',
        },
      },
    ],
  },
  {
    stageNumber: 2,
    phaseCode: 'PHASE-02 // VERIFICATION & TESTING',
    title: 'Aşama 2: Doğrulama & Test Arenası',
    subtitle: 'Market Servisindeki Eşzamanlılık (Concurrency) Çatlağı',
    loreContext:
      "Trafik kuyruğa alındı ancak acil durum telemetrisinde tuhaf bir metrik belirdi: Sezon 5 Özel Sandığı açılırken işlem süresi 400ms'den 3.2 saniyeye fırlıyor. Ekip acil bir yamayı (Hotfix-05) derledi. Ancak saat 00:08 ve yönetim 'hemen yayına alın' diye baskı yapıyor.",
    technicalBriefing:
      "Market servisinde 'SELECT FOR UPDATE' sorgusunda eksik dizin (index) ve transaction izolasyon seviyesi problemi şüphesi var. Eşzamanlı satın alma isteklerinde deadlock riski mevcut.",
    affectedComponents: ['Market Service', 'Transaction Lock Manager', 'Staging Cluster'],
    suggestedQuestions: [
      '10.000 sanal bot testi yapmanın sisteme sağlayacağı gerçek fayda nedir?',
      'Canlıya doğrudan test etmeden yama geçmek deadlock riskini nasıl katlar?',
      'Transaction izolasyon seviyesinde Read Committed vs Serializable arasındaki fark nedir?',
    ],
    defaultChoiceId: 'B', // Panic default if Senior timer runs out
    choices: [
      {
        id: 'A',
        title: '10.000 Bot ile Staging Yük Testi (4 Dk)',
        badge: 'SIKI DOĞRULAMA',
        summary:
          'Yamayı hemen canlıya vermeden önce kopyalanmış Staging kümesinde 10.000 sanal botla eşzamanlı satın alma fırtınası simüle et.',
        tradeOffs: {
          pros: [
            'Canlı ortam riske atılmadan önce deadlock ve thread starvation kusurları yakalanır.',
            'Gerçek veri tabanındaki kilitlenme süreleri (lock wait timeout) netleşir.',
          ],
          cons: [
            '4 dakikalık operasyonel bekleme süresi eklenir.',
            'Staging kümesi için geçici kaynak tüketimi gerçekleşir.',
          ],
        },
        technicalDetails:
          'Locust / k6 script’leri ile 10.000 sanal kullanıcı market/purchase endpoint’ine aynı anda yüklendi. HikariCP pool analizi ve PostgreSQL pg_stat_activity kilit takibi yapıldı.',
        isRecommendedByBestPractice: true,
        metricsImpact: {
          healthDelta: +25,
          errorRateDelta: -10,
          latencyDelta: -350,
          dataIntegrityDelta: +18,
        },
        outcome: {
          whatHappened:
            'Test sırasında botların %12’sinde veritabanı Deadlock (Kilitlenme) tespit edildi! Ekip 2 dakika içinde eksik composite index ve row-level lock sırasını düzelterek yamayı kusursuz hale getirdi ve canlıya dağıttı.',
          whyItHappened:
            'Eşzamanlılık (concurrency) hataları birim testlerde (unit test) asla yakalanmaz; yalnızca yüksek sentetik yük ve yarış koşulu (race condition) senaryolarında gün yüzüne çıkar.',
          rootCauseArchitecture:
            'Staging yük testi, canlı ortamın kilitlenmesini ve veritabanı kilit kaskadını (lock cascade) engelledi.',
          metricsSummary: 'Hata Oranı: %4.4, Sağlık: %89, Deadlock tamamen bertaraf edildi.',
        },
      },
      {
        id: 'B',
        title: 'Testi Atla & Canlıya Dağıt (Yolun Açık Olsun)',
        badge: 'RİSKLİ CANLIYA GEÇİŞ',
        summary: 'Zaman kaybetmemek için derlenen yamayı hiçbir yük testine sokmadan doğrudan tüm prodüksiyon sunucularına bas.',
        tradeOffs: {
          pros: [
            '4 dakika kazanılır, yönetim anlık olarak rahatlar.',
            'Yama hemen yürürlüğe girer.',
          ],
          cons: [
            'Kodun yüksek eşzamanlılık altındaki davranışı tamamen bilinmezdir.',
            'Olası bir deadlock canlı veritabanını felç edebilir.',
          ],
        },
        technicalDetails:
          'Helm upgrade --install production-market ./chart. Test adımları atlanarak doğrudan prod ingress podlarına trafik yönlendirildi.',
        isRecommendedByBestPractice: false,
        metricsImpact: {
          healthDelta: -28,
          errorRateDelta: +24,
          latencyDelta: +1200,
          dataIntegrityDelta: -30,
        },
        outcome: {
          whatHappened:
            'Korkulan oldu! 40.000 oyuncu aynı anda sandık açmaya kalkışınca PostgreSQL transaction kilitleri birbirini kilitledi (Deadlock detected). Veritabanı sorguları 30 saniye boyunca asılı kaldı ve tüm API düğümleri düştü!',
          whyItHappened:
            'Yüksek concurrency altında test edilmeyen transaction kodu, sıralı kilit (ordered locking) kuralını ihlal ettiği için deadlock zincirine yol açtı.',
          rootCauseArchitecture:
            'Yük altında doğrulanmayan hotfix, mikroservis mimarisinde cascading failure (zincirleme çöküş) yarattı.',
          metricsSummary: 'Hata Oranı: %38.4, Sağlık: %36, Veritabanı kilitlenme krizi.',
        },
      },
    ],
  },
  {
    stageNumber: 3,
    phaseCode: 'PHASE-03 // DATA INTEGRITY & AUDIT',
    title: 'Aşama 3: Veri Bütünlüğü ve Ekonomi Krizi',
    subtitle: 'Çift Harcama (Race Condition) ve Sahte Bakiye Anomalisi',
    loreContext:
      "Canlıya geçiş sonrası telemetri veri mühendisleri acil bir alarm tetikledi: Sezon 5 Pazarında bir oyuncu grubunun saniyede 120 paralel satın alma isteği yollayarak bakiyelerini düşürmeden 180.000 sanal 'Aether Coin' ürettiği (duping exploit) tespit edildi!",
    technicalBriefing:
      'Ödeme mikroservisinde idempotent token kontrolü ve veritabanı transaction izolasyonu yetersiz kaldığı için race condition exploit ediliyor. Bu paralar meşru oyuncularla takas edilirse oyun ekonomisi hiperenflasyonla çöker.',
    affectedComponents: ['Wallet Ledger', 'Fraud Detection', 'Market Clearinghouse'],
    suggestedQuestions: [
      'İdempotent anahtar (idempotency key) race condition sorununu nasıl çözer?',
      'Şüpheli hesapları izole etmek yerine görmezden gelmek oyun ekonomisinde hangi tahribatı yaratır?',
      'Veritabanı düzeyinde optimistic lock vs pessimistic lock tercihi bu krizde nasıl rol oynar?',
    ],
    defaultChoiceId: 'B', // Panic ignore
    choices: [
      {
        id: 'A',
        title: 'Log Taraması & Exploit Hesaplarını Karantinaya Al',
        badge: 'CERRAHİ MÜDAHALE',
        summary:
          'Audit loglarını anlık Kafka stream üzerinden filtrele, hileli çoğaltma yapan 1.420 hesabı dondur ve çift harcama ledger düzeltmesini çalıştır.',
        tradeOffs: {
          pros: [
            'Sahte para meşru oyun pazarına akmadan durdurulur.',
            'Oyun sunucuları açık kalır, dürüst 1.2M oyuncu oyunu oynamaya devam eder.',
          ],
          cons: [
            'Arka plandaki stream analizi geçici CPU yükü yaratır.',
            '1.420 hesap geçici itiraz için destek biletleri açabilir.',
          ],
        },
        technicalDetails:
          'Flink / Kafka streaming üzerinde transaction_id hash analizi yapıldı. Idempotency key doğrulaması eksik olan istekler karantinaya alındı; UPDATE wallet SET balance = balance - duped_amount ledger scripti çalıştırıldı.',
        isRecommendedByBestPractice: true,
        metricsImpact: {
          healthDelta: +20,
          errorRateDelta: -8,
          latencyDelta: -100,
          dataIntegrityDelta: +35,
        },
        outcome: {
          whatHappened:
            'Cerrahi müdahale başarıyla tamamlandı! 1.420 hileli hesap anında askıya alındı. Sahte 180.000 coin ekonomiden silindi, meşru oyuncuların hesap cüzdanları kuruşu kuruşuna mutabakatla doğrulandı.',
          whyItHappened:
            'Çift harcama (double spending) açığı veritabanı seviyesinde serializable lock ve idempotency token kontrolü eklenerek kökten kapatıldı.',
          rootCauseArchitecture:
            'Event-driven audit logging ve Idempotency desenleri, finansal kritik servislerin omurgasıdır.',
          metricsSummary: 'Veri Bütünlüğü: %99.8, Sağlık: %96, Pazar ekonomisi kurtarıldı.',
        },
      },
      {
        id: 'B',
        title: 'Görmezden Gel & Servisi Açık Tut (Sabah Bakarız)',
        badge: 'TEKNİK İFLAS',
        summary:
          'Sezon 5 heyecanını bölmemek ve oyuncu şikayetleriyle uğraşmamak için logları incelemeyi yarına ertele, pazarı olduğu gibi açık bırak.',
        tradeOffs: {
          pros: [
            'Şu an için hiçbir hesap dondurulmaz, oyuncular forumda ses çıkarmaz.',
            'Anlık CPU analizi gerekmez.',
          ],
          cons: [
            'Sahte paralar 20 dakika içinde binlerce meşru oyuncuyla takas edilir.',
            'Oyun içi pazar enflasyon patlaması yaşar; tüm sezon ekonomisi zehirlenir.',
          ],
        },
        technicalDetails:
          'Sorun sessizce ertelendi. Race condition exploit bot ağları tarafından otomatikleştirilerek piyasaya milyonlarca sahte coin basıldı.',
        isRecommendedByBestPractice: false,
        metricsImpact: {
          healthDelta: -25,
          errorRateDelta: +12,
          latencyDelta: +300,
          dataIntegrityDelta: -55,
        },
        outcome: {
          whatHappened:
            'Felaket! Ertelenen 2 saat içinde sahte paralar tüm müzayede evine yayıldı. Eşyaların fiyatları 50 katına fırladı. Dürüst oyuncuların emeği hiçe sayıldı; Discord ve Reddit gruplarında boykot çağrıları başladı.',
          whyItHappened:
            'Yazılımda veri bütünlüğü (data integrity) hataları ertelendiğinde doğrusal değil, bileşik faiz gibi üstel (exponential) zarar üretir.',
          rootCauseArchitecture:
            'Ertelenen veri tutarsızlığı, sistem seviyesinden çıkıp şirket düzeyinde itibar ve gelir krizine dönüştü.',
          metricsSummary: 'Veri Bütünlüğü: %12, Sağlık: %24, Ekonomi çöktü.',
        },
      },
    ],
  },
];

export const POST_MORTEM_DATA = {
  STABILIZED: {
    statusBadge: 'SYSTEM STABILIZED // OPERATIONAL SUCCESS',
    title: 'Sezon 5 Başarıyla Kurtarıldı: Dağıtık Sistem Zafere Ulaştı',
    summary:
      'Nöbetçi mühendis olarak uyguladığın mühendislik disiplini ve mimari ilkeler, Aetheria Online altyapısını felaketin eşiğinden çekip aldı. Trafik backpressure ile dizginlendi, eşzamanlılık deadlockları stagingde sönümlendi ve veri bütünlüğü cerrahi müdahaleyle korundu.',
    slaScore: '99.8%',
    dataIntegrityScore: '99.9%',
    csatScore: '94%',
    mttrMinutes: '18 Dakika',
    score: 95,
    fiveWhys: [
      {
        level: 1,
        question: 'Gateway neden 504 Gateway Timeout üretmeye başladı?',
        answer: 'Çünkü 1.2M oyuncunun anlık hücumu arka plandaki podların connection pool sınırını tüketti.',
      },
      {
        level: 2,
        question: 'Connection pool neden bu kadar hızlı tükendi?',
        answer: 'Çünkü istemci uygulamalar agresif retry yaparak thundering herd fırtınası başlattı.',
      },
      {
        level: 3,
        question: 'Market servisi neden satın almalarda kilitlendi?',
        answer: 'Çünkü eksik indeks ve row-level lock çakışmaları concurrency altında deadlock yarattı.',
      },
      {
        level: 4,
        question: 'Deadlock neden canlıyı çökertmedi?',
        answer: 'Çünkü 10.000 botluk staging testi canlıya geçmeden önce kilitlenmeyi yakalayıp düzelttirdi.',
      },
      {
        level: 5,
        question: 'Oyun içi ekonomi nasıl korundu?',
        answer: 'Çünkü çift harcama yapan hesaplar karantinaya alınıp idempotency mekanizması devreye sokuldu.',
      },
    ],
    primerAssessment:
      "Neal Stephenson'ın Diamond Age eserindeki Genç Hanımefendinin Resimli Alfabesi (Illustrated Primer) der ki: 'Gerçek bir usta zanaatkar, rüzgar fırtınaya dönüştüğünde yelkenleri yırtmaz; rüzgarın debisini hidrolik gibi yönetir.' Bu gece sen bir kod yazarı değil, gerçek bir sistem mimarıydın.",
  },
  COLLAPSE: {
    statusBadge: 'SYSTEM COLLAPSE // INFRASTRUCTURE BREAKDOWN',
    title: 'Sezon 5 Altyapı ve Ekonomi Çöküşü: Kritik Sistem Felaketi',
    summary:
      'Baskı altında verilen aceleci veya hatalı kararlar, küçük bir kapasite aşımını zincirleme bir altyapı çöküşüne (cascading failure) dönüştürdü. Test edilmeyen yamalar veritabanını kilitledi, ertelenen veri bütünlüğü açığı ise oyun içi pazar ekonomisini tamamen zehirledi.',
    slaScore: '38.4%',
    dataIntegrityScore: '22.0%',
    csatScore: '12%',
    mttrMinutes: 'Belirsiz (Rollback Zorunlu)',
    score: 25,
    fiveWhys: [
      {
        level: 1,
        question: 'Neden tüm sunucular çöktü ve servis durdu?',
        answer: 'Çünkü test edilmemiş concurrency yaması canlıda kilitlenme kaskadı (lock cascade) yarattı.',
      },
      {
        level: 2,
        question: 'Neden test adımı atlandı?',
        answer: 'Çünkü zaman baskısı ve panik, doğrulama (verification) disiplininin önüne geçti.',
      },
      {
        level: 3,
        question: 'Oyun içi pazar neden kontrolden çıktı?',
        answer: 'Çünkü çift harcama yapan exploit hesapları sonraya ertelenerek sahte paraların yayılmasına izin verildi.',
      },
      {
        level: 4,
        question: 'Rollback neden işe yaramadı?',
        answer: 'Çünkü veritabanındaki DDL migrasyonları ile eski v4.9 kodu arasında şema uyumsuzluğu vardı.',
      },
      {
        level: 5,
        question: 'Kök mimari hata neydi?',
        answer: 'Geriye dönük uyumluluk, backpressure regülasyonu ve idempotency ilkelerinin ihmal edilmesi.',
      },
    ],
    primerAssessment:
      "The Diamond Age'in sayfalarında yazılı kadim kural şudur: 'Mühendislikte test edilmemiş her varsayım, bir sonraki felaketin gizli tetikleyicisidir.' Bu simülasyon bir yenilgi değil; kriz altında soğukkanlı kalmayı ve mimari kök nedenleri anlamayı öğreten paha biçilmez bir derstir.",
  },
};

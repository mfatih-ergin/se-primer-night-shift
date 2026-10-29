describe('SE Primer — Night Shift: Season 5 Zero Hour E2E Test Suite (AI Studio React Build)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('1. Ekran 1: Karşılama, Kişiselleştirme Seçimlerini Doğrular ve Nöbete Başlar', () => {
    cy.contains('SE Primer: Night Shift').should('be.visible');
    cy.contains('ZERO HOUR INCIDENT').should('be.visible');

    // Seviye Seçimi: Senior
    cy.contains('Senior Mühendis').click();

    // Rol Seçimi: SRE / DevOps
    cy.contains('SRE / DevOps').click();

    // Hedef: Hızlı Restorasyon
    cy.contains('Hızlı Restorasyon').click();

    // Simülasyonu Başlat
    cy.contains("Primer'ı Başlat — Nöbeti Devral").click();

    // Kriz Sahnesi ve Telemetri Kontrolü
    cy.contains('MİMARİ DARBOĞAZ').should('be.visible');
    cy.contains('KRİTİK KARAR MATRİSİ').should('be.visible');
  });

  it('2. Başarılı Yol (Happy Path): Kararlar ile STABILIZED Sonucuna Ulaşır', () => {
    cy.contains("Primer'ı Başlat — Nöbeti Devral").click();

    // Aşama 1: Seçenek B (Dinamik Kuyruk & Backpressure)
    cy.contains('Dinamik Kuyruk (Backpressure)').click();
    cy.contains('NE OLDU? (SİSTEM TEPKİSİ)').should('be.visible');
    cy.contains('NEDEN OLDU? (KÖK MİMARİ NEDEN)').should('be.visible');
    cy.contains('İlerle').click();

    // Aşama 2: Seçenek A (10k Bot Yük Testi)
    cy.contains('Aşama 2: Doğrulama & Test Arenası').should('be.visible');
    cy.contains('10.000 Bot ile Staging Yük Testi').click();
    cy.contains('NE OLDU? (SİSTEM TEPKİSİ)').should('be.visible');
    cy.contains('İlerle').click();

    // Aşama 3: Seçenek A (Log Taraması & Exploit İzolasyonu)
    cy.contains('Aşama 3: Veri Bütünlüğü ve Ekonomi Krizi').should('be.visible');
    cy.contains('Log Taraması & Exploit Hesaplarını Karantinaya Al').click();
    cy.contains('NE OLDU? (SİSTEM TEPKİSİ)').should('be.visible');
    cy.contains('Sonuç Raporunu ve Post-Mortem’i Gör').click();

    // Sonuç Ekranı Doğrulaması
    cy.contains('STABILIZED').should('be.visible');
    cy.contains('Mühendislik Raporunu Kopyala').should('be.visible');
  });

  it('3. Felaket Yolu (Disaster Path): Hatalı Kararlar ile COLLAPSED Sonucuna Ulaşır', () => {
    cy.contains("Primer'ı Başlat — Nöbeti Devral").click();

    // Aşama 1: Seçenek A (Panik Rollback)
    cy.contains('Monolitik Bakım Modu & Rollback').click();
    cy.contains('NE OLDU? (SİSTEM TEPKİSİ)').should('be.visible');
    cy.contains('İlerle').click();

    // Aşama 2: Seçenek B (Testi Atla)
    cy.contains('Aşama 2: Doğrulama & Test Arenası').should('be.visible');
    cy.contains('Testi Atla & Canlıya Dağıt').click();
    cy.contains('NE OLDU? (SİSTEM TEPKİSİ)').should('be.visible');
    cy.contains('İlerle').click();

    // Aşama 3: Seçenek B (Görmezden Gel)
    cy.contains('Aşama 3: Veri Bütünlüğü ve Ekonomi Krizi').should('be.visible');
    cy.contains('Görmezden Gel & Servisi Açık Tut').click();
    cy.contains('NE OLDU? (SİSTEM TEPKİSİ)').should('be.visible');
    cy.contains('Sonuç Raporunu ve Post-Mortem’i Gör').click();

    // Çöküş Doğrulaması
    cy.contains('COLLAPSE').should('be.visible');
    cy.contains('SYSTEM COLLAPSE').should('be.visible');
  });

  it('4. Sokratik AI Tutor Etkileşimi: Sokratik Soru ile Yanıt Verir', () => {
    cy.contains("Primer'ı Başlat — Nöbeti Devral").click();

    // Danış butonuna bas
    cy.contains('Danış').click();
    cy.contains('ILLUSTRATED PRIMER SOKRATİK MENTOR').should('be.visible');

    // Soru yaz ve gönder
    cy.get('input[placeholder*="Mimari"]').type('Hangisi doğru cevap A mı B mi?{enter}');

    // Yanıtın Sokratik soru işareti içerdiğini doğrula
    cy.contains('?').should('be.visible');
  });

  it('5. Yeniden Başlatma (Restart) Döngüsü Başarıyla Çalışır', () => {
    cy.contains("Primer'ı Başlat — Nöbeti Devral").click();
    cy.contains('Dinamik Kuyruk (Backpressure)').click();
    cy.contains('İlerle').click();
    cy.contains('Aşama 2: Doğrulama & Test Arenası').should('be.visible');
    cy.contains('10.000 Bot ile Staging Yük Testi').click();
    cy.contains('İlerle').click();
    cy.contains('Aşama 3: Veri Bütünlüğü ve Ekonomi Krizi').should('be.visible');
    cy.contains('Log Taraması & Exploit Hesaplarını Karantinaya Al').click();
    cy.contains('Sonuç Raporunu ve Post-Mortem’i Gör').click();

    // Yeniden Başlat
    cy.contains('Simülasyonu Yeniden Başlat').click();
    cy.contains('SE Primer: Night Shift').should('be.visible');
    cy.contains('ZERO HOUR INCIDENT').should('be.visible');
  });
});

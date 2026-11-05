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

  it('6. Diferansiyel Test (Parite Testi): Python Oracle vs Tarayıcı ONNX Paritesini (< 1e-4) Doğrular', () => {
    // Karşılama ekranındaki Parite Testi modalını aç
    cy.get('[data-cy="open-parity-modal-welcome"]').click();
    cy.get('[data-cy="parity-modal"]').should('be.visible');

    // Durum şeridinin 'PARİTE TAM' olduğunu doğrula
    cy.get('[data-cy="parity-status"]', { timeout: 8000 }).should('contain.text', 'PARİTE TAM');

    // 5 kanonik vakanın hepsinin GEÇTİ (PASS) olduğunu kontrol et
    cy.get('[data-cy="parity-case-1"]').should('contain.text', 'GEÇTİ (PASS)');
    cy.get('[data-cy="parity-case-2"]').should('contain.text', 'GEÇTİ (PASS)');
    cy.get('[data-cy="parity-case-3"]').should('contain.text', 'GEÇTİ (PASS)');
    cy.get('[data-cy="parity-case-4"]').should('contain.text', 'GEÇTİ (PASS)');
    cy.get('[data-cy="parity-case-5"]').should('contain.text', 'GEÇTİ (PASS)');

    // Modal kapatma
    cy.contains('Kapat').click();
    cy.get('[data-cy="parity-modal"]').should('not.exist');
  });

  it('7. Adaptif ONNX Model Çıkarımı: Karar Arenasında Gerçek Zamanlı Panik Olasılığını Gösterir', () => {
    cy.contains("Primer'ı Başlat — Nöbeti Devral").click();

    // Adaptif model rozetinin görünür olduğunu doğrula
    cy.get('[data-cy="ml-panic-badge"]').should('be.visible');
    cy.contains('ADAPTİF MODEL').should('be.visible');

    // Panik olasılığı yüzdesinin render edildiğini doğrula
    cy.get('[data-cy="ml-panic-prob"]').should('be.visible').and('contain.text', '%');
  });
});

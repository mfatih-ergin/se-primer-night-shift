describe('SE Primer — Night Shift: Season 5 Zero Hour E2E Test Suite', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('1. Ekran 1: Karşılama ve Kişiselleştirme Seçimlerini Doğrular', () => {
    cy.get('#screenOnboarding').should('be.visible');
    cy.get('h1').should('contain', 'Night Shift');

    // Seviye Seçimi: Senior
    cy.get('.option-btn[data-group="level"][data-value="senior"]').click();
    cy.get('.option-btn[data-group="level"][data-value="senior"]').should('have.class', 'selected');

    // Rol Seçimi: SRE
    cy.get('.option-btn[data-group="role"][data-value="sre"]').click();
    cy.get('.option-btn[data-group="role"][data-value="sre"]').should('have.class', 'selected');

    // Hedef: Sıfır Veri Kaybı
    cy.get('.option-btn[data-group="goal"][data-value="zero-loss"]').click();
    cy.get('.option-btn[data-group="goal"][data-value="zero-loss"]').should('have.class', 'selected');

    // Oyunu Başlat
    cy.get('#btnStartGame').click();
    cy.get('#screenDecision').should('be.visible');
    cy.get('#roleLabel').should('contain', 'SRE / INFRA [SENIOR]');
    cy.get('#seniorTimerBar').should('be.visible');
  });

  it('2. Başarılı Yol (Happy Path): B -> A -> A Kararları ile Başarılı Son (STABILIZED)', () => {
    // Junior Başlat
    cy.get('#btnStartGame').click();
    cy.get('#screenDecision').should('be.visible');

    // Aşama 1: Mimari & Trafik -> B Seçimi (Kuyruk & Canlı Yama)
    cy.get('#stageBadge').should('contain', 'AŞAMA 1');
    cy.get('#choiceBtnB').click();
    cy.get('#feedbackBox').should('be.visible');
    cy.get('#feedbackWhat').should('contain', 'Kademeli kuyruk (backpressure) devreye alındı');
    cy.get('#feedbackWhy').should('contain', 'Sistem trafiği yumuşatıldı');
    cy.get('#btnNextStep').click();

    // Aşama 2: Doğrulama & Test -> A Seçimi (10k Bot Yük Testi)
    cy.get('#stageBadge').should('contain', 'AŞAMA 2');
    cy.get('#choiceBtnA').click();
    cy.get('#feedbackBox').should('be.visible');
    cy.get('#feedbackWhat').should('contain', '10.000 sanal bot testi');
    cy.get('#btnNextStep').click();

    // Aşama 3: Veri Bütünlüğü & Ekonomi -> A Seçimi (Log Taraması & Hile İzolasyonu)
    cy.get('#stageBadge').should('contain', 'AŞAMA 3');
    cy.get('#choiceBtnA').click();
    cy.get('#feedbackBox').should('be.visible');
    cy.get('#feedbackWhat').should('contain', 'Loglar taranarak 1.200 exploit hesabı izole edildi');
    cy.get('#btnNextStep').click();

    // Ekran 3: Sonuç Ekranı Doğrulaması
    cy.get('#screenResult').should('be.visible');
    cy.get('#outcomeBadge').should('contain', 'STABILIZED · BAŞARILI SON');
    cy.get('#outcomeHeading').should('contain', 'Sezon 5 Kurtarıldı!');
    cy.get('#finalDataIntegrity').should('contain', '%100');
    cy.get('#finalEconomy').should('contain', 'GÜVENDE');
  });

  it('3. Felaket Yolu (Disaster Path): A -> B -> B Kararları ile Çöküş Sonu (COLLAPSE)', () => {
    cy.get('#btnStartGame').click();

    // Aşama 1: A Seçimi (Panik Rollback)
    cy.get('#choiceBtnA').click();
    cy.get('#feedbackWhat').should('contain', 'Tüm lobiler ve soketler anında kapatıldı');
    cy.get('#btnNextStep').click();

    // Aşama 2: B Seçimi (Testi Atla)
    cy.get('#choiceBtnB').click();
    cy.get('#feedbackWhat').should('contain', 'race condition yayıldı');
    cy.get('#btnNextStep').click();

    // Aşama 3: B Seçimi (Logları Görmezden Gel)
    cy.get('#choiceBtnB').click();
    cy.get('#feedbackWhat').should('contain', 'Dupe eşyalar serbest pazara saçıldı');
    cy.get('#btnNextStep').click();

    // Ekran 3: Çöküş Doğrulaması
    cy.get('#screenResult').should('be.visible');
    cy.get('#outcomeBadge').should('contain', 'COLLAPSE · FELAKET SON');
    cy.get('#outcomeHeading').should('contain', 'Ekonomi ve İtibar Çöktü!');
    cy.get('#finalEconomy').should('contain', 'ÇÖKTÜ');
  });

  it('4. Sokratik AI Tutor Etkileşimi: Asla Doğrudan Cevap Vermez', () => {
    cy.get('#btnStartGame').click();

    // Tutor modalını aç
    cy.contains('Sokratik AI Rehber').click();
    cy.get('#tutorModal').should('have.class', 'open');
    cy.get('#tutorResponse').should('be.visible');

    // "Hangisi doğru cevap?" sorusunu sor
    cy.contains('Hangisi doğru cevap? A mı B mi?').click();
    cy.get('#tutorResponse').should('contain', 'Bir mühendisin görevi hazır cevap seçmek değil');

    // Modalı kapat
    cy.get('.close-btn').click();
    cy.get('#tutorModal').should('not.have.class', 'open');
  });

  it('5. Yeniden Başlatma (Restart) Döngüsü Başarıyla Çalışır', () => {
    cy.get('#btnStartGame').click();
    cy.get('#choiceBtnB').click();
    cy.get('#btnNextStep').click();
    cy.get('#choiceBtnA').click();
    cy.get('#btnNextStep').click();
    cy.get('#choiceBtnA').click();
    cy.get('#btnNextStep').click();

    // Sonuç ekranındayken yeniden başlat
    cy.get('#btnRestart').click();
    cy.get('#screenOnboarding').should('be.visible');
    cy.get('#screenResult').should('not.be.visible');
  });
});

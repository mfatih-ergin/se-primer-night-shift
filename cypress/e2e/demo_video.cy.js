describe('SE Primer — 60-90s Demo Video: Aynı Sahnede İki Farklı Oyuncu ve Model Davranışı', () => {
  it('Aynı sahnede modelin iki farklı karar verdiği iki oyuncuyu ve parite testini gösterir', () => {
    // Mobil görünüm
    cy.viewport(412, 892);
    cy.visit('/');

    // =========================================================================
    // 1. BÖLÜM: OYUNCU 1 — SOĞUKKANLI SENIOR MÜHENDİS (Düşük Panik Riski)
    // =========================================================================
    cy.contains('SE Primer: Night Shift').should('be.visible');
    cy.contains('Senior Mühendis').click();
    cy.contains('SRE / DevOps').click();
    cy.contains('Sıfır Veri Kaybı').click();
    cy.wait(2000);

    // Kriz Başlat
    cy.contains("Primer'ı Başlat — Nöbeti Devral").click();
    cy.contains('MİMARİ DARBOĞAZ').should('be.visible');

    // Telemetriyi soğukkanlılıkla inceler (Süre az, kararsız tıklama yok)
    cy.wait(4000);

    // Adaptif Modelin Soğukkanlı olduğunu doğrula (P < 0.40)
    cy.get('[data-cy="ml-panic-badge"]').should('be.visible');
    cy.contains('Soğukkanlı Mühendis').should('be.visible');
    cy.wait(3000);

    // Doğru mimari kararı seçer
    cy.contains('Dinamik Kuyruk (Backpressure)').click();
    cy.contains('NE OLDU? (SİSTEM TEPKİSİ)').should('be.visible');
    cy.wait(4000);
    cy.contains('İlerle').click();
    cy.wait(3000);

    // =========================================================================
    // 2. BÖLÜM: OYUNCU 2 — BİLİŞSEL AŞIRI YÜKLENME YAŞAYAN JUNIOR MÜHENDİS (Panik)
    // =========================================================================
    // Ana ekrana dönmek için simülasyonu başa saralım
    cy.visit('/');
    cy.contains('Junior Mühendis').click();
    cy.contains('Backend Mühendisi').click();
    cy.wait(2000);
    cy.contains("Primer'ı Başlat — Nöbeti Devral").click();

    // Aşama 1: Oyuncu bocalıyor, süre uzuyor, seçenekler arasında gidip geliyor
    cy.contains('Aşama 1: Mimari & Trafik Triage').should('be.visible');

    // Önce A'yı ön-seçer (şüphe)
    cy.wait(3000);
    cy.get('[data-cy="select-choice-A"]').click();
    cy.wait(2000);

    // Sonra B'ye geçer (kararsızlık)
    cy.get('[data-cy="select-choice-B"]').click();
    cy.wait(2000);

    // Tekrar A'ya basar (kararsız tıklama sayısı artar)
    cy.get('[data-cy="select-choice-A"]').click();
    cy.wait(2000);

    // Danışman ipucu butonuna basar
    cy.contains('Danış').click();
    cy.wait(3000);
    cy.get('button:has(svg.lucide-x)').first().click();
    cy.wait(3000);

    // İkinci kez danışır
    cy.contains('Danış').click();
    cy.wait(3000);
    cy.get('button:has(svg.lucide-x)').first().click();
    cy.wait(3000);

    // Süre ilerledikçe ve kararsızlık arttıkça model aşırı yüklenme tespit eder (P >= 0.65)
    cy.get('[data-cy="ml-alert-banner"]', { timeout: 25000 }).should('be.visible');
    cy.contains('PROAKTİF SOKRATİK MÜDAHALE').should('be.visible');
    cy.wait(6000);

    // =========================================================================
    // 3. BÖLÜM: DİFERANSİYEL TEST KAHİNİ (ORACLE) PARİTE DOĞRULAMASI
    // =========================================================================
    cy.get('[data-cy="open-parity-modal"]').click();
    cy.get('[data-cy="parity-modal"]').should('be.visible');
    cy.get('[data-cy="parity-status"]').should('contain.text', 'PARİTE TAM');
    cy.wait(6000);
    cy.contains('Kapat').click();
    cy.wait(2000);
  });
});

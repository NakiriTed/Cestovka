describe('Ověření funkčnosti modulů bakalářské práce (E2E)', () => {
  it('1. Úvodní stránka, přepínání jazyka (CZ/EN) a motivu (Dark/Light)', () => {
    cy.visit('/');
    cy.get('h1').should('be.visible');

    // Přepnutí jazyka na EN a zpět na CZ
    cy.get('#lang-switcher button').contains('EN').click();
    cy.get('html').should('have.attr', 'lang', 'en');
    cy.get('#lang-switcher button').contains('CZ').click();
    cy.get('html').should('have.attr', 'lang', 'cs');

    // Přepnutí motivu
    cy.get('#theme-toggle').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
    cy.get('#theme-toggle').click();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
  });

  it('2. Plánovač cest a tvorba vlastního itineráře (AI Plánovač)', () => {
    cy.visit('/planner');
    cy.get('h1').should('be.visible');

    // Otevření modálu pro sestavení vlastního itineráře
    cy.get('[data-testid="custom-builder-open"]').click();
    cy.contains('Sestavit vlastní itinerář').should('be.visible');
    cy.get('input[placeholder*="Moje jarní cesta"]').type('Moje testovací cesta po Japonsku');
    cy.contains('Uložit a zobrazit itinerář').click();

    // Ověření, že se zobrazil detail nově vytvořeného itineráře
    cy.contains('Moje testovací cesta po Japonsku').should('be.visible');
    cy.contains('Program zájezdu den po dni').should('be.visible');
  });

  it('3. Výukový modul japonštiny (fráze, Hiragana, Katakana, AI Lektor & Kvíz)', () => {
    cy.visit('/japonsky');
    cy.get('h1').should('contain', 'japonsky');

    // Otočení 3D kartičky fráze
    cy.get('.phrase-card').first().click().should('have.class', 'flipped');

    // Přepnutí na Hiraganu, Katakanu a AI Lektor & Kvíz
    cy.get('.mode-tab-btn').contains('Hiragana').click();
    cy.get('.kana-card').should('have.length.greaterThan', 40);

    cy.get('.mode-tab-btn').contains('Katakana').click();
    cy.get('.kana-card').should('have.length.greaterThan', 40);

    cy.get('.mode-tab-btn').contains('AI Lektor').click();
    cy.contains('Procvičovací kvíz').should('be.visible');
  });

  it('4. Výukový modul korejštiny (fráze, Hangul, AI Lektor & Kvíz)', () => {
    cy.visit('/korejsky');
    cy.get('h1').should('contain', 'korejsky');

    cy.get('.mode-tab-btn').contains('Hangul').click();
    cy.get('.hangul-card').should('have.length.greaterThan', 10);

    cy.get('.mode-tab-btn').contains('AI Lektor').click();
    cy.contains('Procvičovací kvíz').should('be.visible');
  });

  it('5. Fotogalerie a filtrování podle destinací', () => {
    cy.visit('/gallery');
    cy.get('h1').should('be.visible');
    cy.get('.filter-btn').contains('Japonsko').click();
    cy.get('img').should('have.length.greaterThan', 0);
  });

  it('6. Diskusní fórum a zobrazení detailu vlákna', () => {
    cy.visit('/forum');
    cy.get('h1').should('be.visible');
    cy.get('[role="button"]').first().click();
    cy.contains('Odpovědi').should('be.visible');
  });

  it('7. Interaktivní mapa destinací', () => {
    cy.visit('/map');
    cy.get('h1').should('contain', 'Interaktivní mapa');
  });
});

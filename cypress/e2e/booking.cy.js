describe('Rezervační proces (E2E)', () => {
  it('Mělo by projít až k rezervačnímu formuláři', () => {
    cy.visit('/planner');
    
    // Klikneme na poslední vyrenderovanou kartu (první je vyprodaná!)
    cy.get('.phrase-category-tag', { timeout: 10000 }).should('be.visible').last().click();
    
    // Počkáme na načtení detailu
    cy.contains('Program zájezdu', { timeout: 10000 }).should('be.visible');
    
    // Klikneme na rezervační tlačítko (hledáme podle klíčového slova a použijeme force click v případě animace)
    cy.contains('Rezervovat', { timeout: 10000 }).first().click({ force: true });
    
    // Ověříme okno
    cy.contains('Rezervace zájezdu', { timeout: 10000 }).should('exist');
  });
});

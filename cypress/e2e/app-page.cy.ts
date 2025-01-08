describe('App page', () => {
  it('should render 2 buttons', () => {
    cy.visit('http://localhost:3000');
    cy.get('a[href="/signup"]').should('be.visible');
    cy.get('a[href="/login"]').should('be.visible');
  });
  it('buttons redirect to correct pages', () => {
    cy.visit('http://localhost:3000');
    cy.get('a[href="/signup"]').click();
    cy.url().should('include', '/signup');
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');
  });
})
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
  // it('should allow user to register',()=>{
  //   cy.visit('http://localhost:3000/signup');
  //   cy.get('input[name="name"]').type('testUser');
  //   cy.get('input[name="email"]').type('testUser@gmail.com');
  //   cy.get('input[name="password"]').type('testUser123');
  //   cy.get('button[type="submit"]').click();
  //   cy.url().should('include', '/home');
  // })
})
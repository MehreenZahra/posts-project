describe('Login Page', ()=>{
    it('should allow users to login', () => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type('testUser@gmail.com');
        cy.get('input[name="password"]').type('testUser123');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/home');
      });
    
})
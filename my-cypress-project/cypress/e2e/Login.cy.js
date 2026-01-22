describe('Login', () => {  
    it('should log in successfully with valid credentials', () => {
        cy.visit('https://arthtattva-fe.dev.perimattic.dev/');
        cy.get('button').contains('Sign In').click();
        cy.get('input[placeholder="Enter Email ID"]').type('jay.patel@perimattic.com');
        cy.get('input[placeholder="Min. 8 Characters"]').type('Jay8433$');
        cy.get('button').contains('Log In').click();
        cy.url().should('include', '/dashboard');
       
    });
 
    // it('should show error message with invalid credentials', () => {
    //     cy.visit('/login');
    //     cy.get('input[name="username"]').type('invalidUser');
    //     cy.get('input[name="password"]').type('invalidPassword');
    //     cy.get('button[type="submit"]').click();
    //     cy.contains('Invalid username or password').should('be.visible');
    // }
    // );
});
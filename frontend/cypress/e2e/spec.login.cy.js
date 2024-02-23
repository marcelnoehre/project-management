// Wrong user
describe('Login process error cases', () => {
    // invalid username
    sessionStorage.clear();
    it('Should block invalid username', () => {
        cy.viewport(1600, 900);
        cy.invalidUsername();
        cy.url().should('include', '/login');
    })

    // invalid password
    sessionStorage.clear();
    it('Should block invalid password', () => {
        cy.viewport(1600, 900);
        cy.invalidPassword ();
        cy.url().should('include', '/login');
    })
});

// Correct credentials
describe('Login process valid', () => {
    sessionStorage.clear();
    it('Should login with valid credentials', () => {
        cy.viewport(1600, 900);
        cy.loginCorrect();
        cy.url().should('include', '');
    })
});

// Redirect ot registration
describe('Redirect to registration', () => {
    sessionStorage.clear();
    it('Should redirect to registration', () => {
        cy.viewport(1600, 900);
        cy.redirectRegistration();
        cy.url().should('include', '/registration');
    });
});
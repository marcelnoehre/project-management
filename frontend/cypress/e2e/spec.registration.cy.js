// Invalid data
describe('Invalid registration inputs', () => {
    // invalid username
    sessionStorage.clear();
    it('Should block invalid username', () => {
        cy.viewport(1600, 900);
        cy.registrationInvalidUsername();
    });

    // invalid full name
    sessionStorage.clear();
    it('Should block invalid full name', () => {
        cy.viewport(1600, 900);
        cy.registrationInvalidFullName();
    });

    // invalid password
    sessionStorage.clear();
    it('Should block invalid password', () => {
        cy.viewport(1600, 900);
        cy.registrationInvalidPassword();
    });

    // invalid password repeat
    sessionStorage.clear();
    it('Should block invalid password repeat', () => {
        cy.viewport(1600, 900);
        cy.registrationInvalidPasswordRepeat();
    });

    // blocked username
    sessionStorage.clear();
    it('Should block used username', () => {
        cy.viewport(1600, 900);
        cy.blockedRegistration();
        cy.url().should('include', '/registration');
    });
});

// Valid account information
describe('Registration process valid', () => {
    sessionStorage.clear();
    it('Should register with valid account information', () => {
        cy.viewport(1600, 900);
        cy.validRegistration();
        cy.url().should('include', '/login');
    });
});

// Redirect to login
describe('Redirect to login', () => {
    sessionStorage.clear();
    it('Should redirect to login', () => {
        cy.viewport(1600, 900);
        cy.registrationRedirectLogin();
        cy.url().should('include', '/login');
    });
});
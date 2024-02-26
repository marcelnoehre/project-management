// Wrong user
describe('Login process error cases', () => {
    // invalid username
    sessionStorage.clear();
    it('Should block invalid username', () => {
        cy.viewport(1600, 900);
        cy.loginInvalidUsername();
        cy.url().should('include', '/login');
    })

    // invalid password
    sessionStorage.clear();
    it('Should block invalid password', () => {
        cy.viewport(1600, 900);
        cy.loginInvalidPassword ();
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
    });
});

// Correct credentials unassigned User (username: none)
describe('login process valid with User none', () => {
    sessionStorage.clear();
    it('Should login with credentials none', () => {
        cy.viewport(1600, 900);
        cy.loginUserNone();
        cy.url().should('include', '/login');
    });
});

// Redirect ot registration
describe('Redirect to registration', () => {
    sessionStorage.clear();
    it('Should redirect to registration', () => {
        cy.viewport(1600, 900);
        cy.loginRedirectRegistration();
        cy.url().should('include', '/registration');
    });
});


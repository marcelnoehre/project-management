// Wrong user
describe('Login process error cases', () => {
    // invalid username
    sessionStorage.clear();
    it('Username invalid', () => {
        cy.viewport(1600, 900);
        cy.invalidUsername();
        cy.url().should('include', '/login');
    })

    // invalid password
    sessionStorage.clear();
    it('Password invalid', () => {
        cy.viewport(1600, 900);
        cy.invalidPassword ();
        cy.url().should('include', '/login');
    })
  });

  // Correct credentials
  describe('Login process correct', () => {
    sessionStorage.clear();
    it('Login if credentials are valid', () => {
        cy.viewport(1600, 900);
        cy.loginCorrect();
        cy.url().should('include', '');
    })
});
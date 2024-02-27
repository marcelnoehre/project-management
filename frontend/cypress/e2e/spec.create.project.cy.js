// Login user without assigned Project + canceling the test project
describe('Login to cancel the creating of a project', () => {
  sessionStorage.clear();
  it('Should log in user without project and cancel project creation', () => {
      cy.viewport(1600, 900);
      cy.loginUserNoneCancel();
  });
});

//Login User without assigned Project + creating a test project
describe('Login to create a project', () => {
  sessionStorage.clear();
    it('Should log in user without project and create a project', () => {
        cy.viewport(1600, 900);
        cy.loginUserNoneCreate();
    });
});
  
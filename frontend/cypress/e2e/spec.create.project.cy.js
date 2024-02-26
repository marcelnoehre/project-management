describe('Login to create a Task', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Should log in with username "none" and password "1234" + create a  "testCreat" project', () => {
        cy.viewport(1600, 900);
        cy.loginUserNoneCreate();
    });
});
  
// Login user without assigned Project + canceling the test project
describe('Login process valid', () => {
  sessionStorage.clear();
  it('Should log in with username "none" and password "1234" + cancel the creation of "test" project', () => {
      cy.viewport(1600, 900);
      cy.loginUserNoneCancel();
  });
});
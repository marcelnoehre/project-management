describe('Importing a task into the board ', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Should open the module "import task" and click in document button', () => {
        cy.viewport(1600, 900);
        cy.importTask();
        cy.url().should('include', '/tasks/import');
    });
});





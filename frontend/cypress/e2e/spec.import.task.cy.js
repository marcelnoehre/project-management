// Import Button test
describe('Importing a task into the board ', () => {
  sessionStorage.clear();
    it('Should use the document upload button', () => {
        cy.viewport(1600, 900);
        cy.importTask();
        cy.url().should('include', '/tasks/import');
    });
});





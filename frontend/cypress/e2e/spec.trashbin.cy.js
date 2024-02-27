// restore task
describe('Restore a task in trashbin', () => {
  sessionStorage.clear();
    it('Should display snackbar information: restored task', () => {
        cy.viewport(1600, 900);
        cy.trashBinActionRestore();
        cy.url().should('include', '/trash-bin');
    });
});

// delete task
describe('Delete a task in trashbin', () => {
  sessionStorage.clear();
    it('Should delete task and display snackbar information: task deleted', () => {
        cy.viewport(1600, 900);
        cy.trashBinActionDelete();
        cy.url().should('include', '/trash-bin');
    });
});

//Login User without assigned Project + creating a test project
describe('Clear trashbin', () => {
  sessionStorage.clear();
    it('Should display empty list', () => {
        cy.viewport(1600, 900);
        cy.trashBinActionClear();
        cy.url().should('include', '/trash-bin');
    });
});
  

  



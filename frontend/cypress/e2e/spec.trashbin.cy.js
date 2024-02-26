describe('Action to restore a task in the trash-bin ', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Should visit Trash bin and do action "restore"', () => {
        cy.viewport(1600, 900);
        cy.trashBinActionRestore();
        cy.url().should('include', '/trash-bin');
    });
});


describe('Action to delete a task in the trash-bin', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Should visit Trash bin and do action "delete"', () => {
        cy.viewport(1600, 900);
        cy.trashBinActionDelete();
        cy.url().should('include', '/trash-bin');
    });
});


describe('Action to clear a task in the trash-bin', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Should visit Trash bin and do action "delete"', () => {
        cy.viewport(1600, 900);
        cy.trashBinActionClear();
        cy.url().should('include', '/trash-bin');
    });
});
  

  



describe('Action to restore a task in the trash-bin ', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Should visit Trash bin and do action "restore"', () => {
        cy.viewport(1600, 900);
        cy.chartClicks();
        cy.url().should('include', '/stats');
    });
});

describe('Action to restore a task in the trash-bin ', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Should visit Trash bin and do action "restore"', () => {
        cy.viewport(1600, 900);
        cy.refreshButtonsAll();
        cy.url().should('include', '/stats');
    });
});


describe('Action to restore a task in the trash-bin ', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Should visit Trash bin and do action "restore"', () => {
        cy.viewport(1600, 900);
        cy.regenerateAllStats();
        cy.url().should('include', '/stats');
    });
});





  



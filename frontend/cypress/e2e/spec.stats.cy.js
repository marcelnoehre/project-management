// Clicking on the charts to update visuals 
describe('Testing clickable charts', () => {
  sessionStorage.clear();
    it('Should update the chartview', () => {
        cy.viewport(1600, 900);
        cy.chartClicks();
        cy.url().should('include', '/stats');
    });
});

// Pressing all refresh buttons
describe('Testing all refresh buttons', () => {
  sessionStorage.clear();
    it('Should refresh each chart/data', () => {
        cy.viewport(1600, 900);
        cy.refreshButtonsAll();
        cy.url().should('include', '/stats');
    });
});


// Testing button
describe('Testing regenerate all task button', () => {
  sessionStorage.clear();
    it('Should load the page again', () => {
        cy.viewport(1600, 900);
        cy.regenerateAllStats();
        cy.url().should('include', '/stats');
    });
});





  



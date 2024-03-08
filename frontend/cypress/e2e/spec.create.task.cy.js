// Creating an invalid tesk task
describe('Create a invalid Task', () => {
  sessionStorage.clear();
    it('should block create button and validate input fields', () => {
        cy.viewport(1600, 900);
        cy.createTaskInvalid();
        cy.url().should('include', '/create');
    });
});
    

// Creating a valid test task
describe('Create a valid Task', () => {
  sessionStorage.clear();
    it('Should create a task succesfully with snackbar info', () => {
        cy.viewport(1600, 900);
        cy.createTaskValid();
        cy.url().should('include', '/create');
    });
});

    
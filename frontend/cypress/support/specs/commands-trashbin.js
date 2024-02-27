import * as data from '../../fixtures/data.json';

//General constants
const loginRoute = 'http://localhost:4200/login';
const waitTime = data.waitTime;
const beEnabled = data.beEnabled;

// Constants to access HTML
const usernameInput = '[data-cy="login-username"]';
const passwordInput = '[data-cy="login-password"]';
const hidePassword = '[data-cy="login-hide-password"]';
const loginButton = '[data-cy="login-submit"]';
const dashboardCreateTask = '[data-cy=dashboard-app-TRASH_BIN]';
const restoreData = '[data-cy="restore-data"]';
const deleteData = '[data-cy="delete-data"]';
const clearData = '[data-cy="clear-data"]';

// constants for user input
const username = data.user.username.owner;
const password = data.user.password.mock;


// Restore a task that was moved to trashbin
Cypress.Commands.add('trashBinActionRestore', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to trash-bin
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Button to restore task
    cy.get(restoreData).eq(0).click().wait(waitTime);
});

// delete a task in the trash bin
Cypress.Commands.add('trashBinActionDelete', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // navigate to trashbin
    cy.get(dashboardCreateTask).click().wait(waitTime);
    cy.get(deleteData).eq(0).click().wait(waitTime);
});

// clear your trashbin and delete all tasks in in 
Cypress.Commands.add('trashBinActionClear', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // navigate to trashbin
    cy.get(dashboardCreateTask).click().wait(waitTime);
    cy.get(clearData).click().wait(waitTime);
});






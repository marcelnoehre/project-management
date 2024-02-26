import * as data from '../../fixtures/data.json';

//General constants
const loginRoute = 'http://localhost:4200/login';
const waitTime = data.waitTime;
const beEnabled = 'be.enabled';

// Constants to access HTML
const usernameInput = '[data-cy="login-username"]';
const passwordInput = '[data-cy="login-password"]';
const hidePassword = '[data-cy="login-hide-password"]';
const loginButton = '[data-cy="login-submit"]';
const dashboardCreateTask = '[data-cy=dashboard-app-IMPORT_TASKS]';
const importButton = '[data-cy="import-task"]';


// constants for user input
const username = data.user.username.owner;
const password = data.user.password.mock;


// Valid login
Cypress.Commands.add('importTask', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(dashboardCreateTask).click().wait(waitTime);
    cy.get(importButton).click({force: true}).wait(waitTime);
});








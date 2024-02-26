import * as data from '../../fixtures/data.json';

// General constants
const loginRoute = 'http://localhost:4200/login';
//const loginRouteProject ='http://localhost:4200'
const waitTime = data.waitTime;
const beEnabled = 'be.enabled';

// Constants to access HTML
const usernameInput = '[data-cy="login-username"]';
const passwordInput = '[data-cy="login-password"]';
const hidePassword = '[data-cy="login-hide-password"]';
const loginButton = '[data-cy="login-submit"]';
const projectInput = '[data-cy="project-submit"]';
const createProjectButton = '[data-cy="project-submit-create"]';
const cancelProjectButton = '[data-cy="project-submit-cancel"]';

// Constants for user input
const invalid = data.invalid;
const noneUsername = 'none';
const validPassword = '1234';
const testProjectCreate= 'testCreate';
const testProjectCancel= 'testCancel'

// Login with "none" user and "1234" password
Cypress.Commands.add('loginUserNoneCreate', () => {
    cy.visit(loginRoute);

    cy.get(usernameInput).click({ force: true }).type(noneUsername).wait(waitTime);
    cy.get(passwordInput).click({ force: true }).type(validPassword).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(projectInput).click({ force: true }).type(testProjectCreate).wait(waitTime);
    cy.get(createProjectButton).should(beEnabled);
    cy.get(createProjectButton).click({ force: true }).wait(waitTime);
    //cy.visit(loginRouteProject);
}); 

Cypress.Commands.add('loginUserNoneCancel', () => {
    cy.visit(loginRoute);

    cy.get(usernameInput).click({ force: true }).type(noneUsername).wait(waitTime);
    cy.get(passwordInput).click({ force: true }).type(validPassword).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(projectInput).click({ force: true }).type(testProjectCancel).wait(waitTime);
    //cy.get(cancelProjectButton).should(beEnabled);
    cy.get(cancelProjectButton).click({ force: true }).wait(waitTime);
}); 

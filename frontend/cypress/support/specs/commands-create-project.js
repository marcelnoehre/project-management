import * as data from '../../fixtures/data.json';

// General constants
const loginRoute = 'http://localhost:4200/login';
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
const noneUsername = data.user.username.none;
const validPassword = data.user.password.mock;
const buttonCreateProject= data.project.description.testCreate;
const buttonCancelProject= data.project.description.testCancel


// Login in but cancel the creation of project
Cypress.Commands.add('loginUserNoneCancel', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({ force: true }).type(noneUsername).wait(waitTime);
    cy.get(passwordInput).click({ force: true }).type(validPassword).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(projectInput).click({ force: true }).type(buttonCancelProject).wait(waitTime);

    // cancel button
    cy.get(cancelProjectButton).click({ force: true }).wait(waitTime);
}); 

// Login with user:none and password:1234 für unassinged user
Cypress.Commands.add('loginUserNoneCreate', () => {
    cy.visit(loginRoute);
    // valid credentials 
    cy.get(usernameInput).click({ force: true }).type(noneUsername).wait(waitTime);
    cy.get(passwordInput).click({ force: true }).type(validPassword).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(projectInput).click({ force: true }).type(buttonCreateProject).wait(waitTime);

    // create project with button
    cy.get(createProjectButton).should(beEnabled);
    cy.get(createProjectButton).click({ force: true }).wait(waitTime); 
}); 


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
const registrationLink = '[data-cy="registration-link"]';

// constants for user input
const username = data.user.username.owner;
const password = data.user.password.mock;
const invalid = data.invalid;

// login with invalid credentials
Cypress.Commands.add('invalidUsername', () => {
    cy.visit(loginRoute);
    // username wrong
    cy.get(usernameInput).click({force: true}).type(invalid).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled).wait(waitTime);
});

Cypress.Commands.add('invalidPassword', () => {
    cy.visit(loginRoute);
    // password wrong
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(invalid).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled).wait(waitTime);
});

// Valid login
Cypress.Commands.add('loginCorrect', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
});

// Registration
Cypress.Commands.add('redirectRegistration', () => {
    cy.visit(loginRoute);
    // redirect to registration 
    cy.get(registrationLink).click().wait(waitTime);
});

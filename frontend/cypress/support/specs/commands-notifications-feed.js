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
const notificationOn = '[data-cy="notifications-on"]';
const notificationOff = '[data-cy="notifications-off"]';
const notificationDialog = '[data-cy="show-notifications-dialog"]';
const userMenu = '[data-cy="user-menu"]';
const deleteNotification = '[data-cy="delete-notifications"]';
const toolbarLogout = '[data-cy="toolbar-logout"]';


// constants for user input
const username = data.user.username.admin;
const password = data.user.password.mock;


Cypress.Commands.add('notificationToggle', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(notificationOn).click({force: true}).wait(waitTime);
    cy.get(notificationOff).click({force: true}).wait(waitTime);
    cy.get(notificationOn).click({force: true}).wait(waitTime);
});


Cypress.Commands.add('notificationDialog', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(userMenu).click().wait(waitTime);
    cy.get(notificationDialog).click().wait(waitTime);
    cy.get(deleteNotification).eq(0).click().wait(waitTime);
    cy.get(deleteNotification).eq(0).click().wait(waitTime);
});

Cypress.Commands.add('toolbarLogout', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(userMenu).click().wait(waitTime);
    cy.get(toolbarLogout).click().wait(waitTime);
});











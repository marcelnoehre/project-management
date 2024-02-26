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
const dashboardCreateTask = '[data-cy=dashboard-app-PROJECT_SETTINGS]';
const removeUserButton = '[data-cy="remove-user"]';
const dialogFalse = '[data-cy="dialog-button-false"]';
const dialogTrue = '[data-cy="dialog-button-true"]';
const leaveProject = '[data-cy="leave-project"]';
const inviteMemberInput = '[data-cy="invite-member-input"]';
const inviteMemberButton = '[data-cy="invite-member-button"]';



// constants for user input
const username = data.user.username.admin;
const password = data.user.password.mock;
const testInvite = 'testuser';


Cypress.Commands.add('projectSettingsDeleteUser', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(dashboardCreateTask).click().wait(waitTime);
    cy.get(removeUserButton).eq(0).click({force: true}).wait(waitTime);
    cy.get(dialogTrue).click().wait(waitTime);
});


Cypress.Commands.add('projectSettingsCancelDelete', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(dashboardCreateTask).click().wait(waitTime);
    cy.get(removeUserButton).eq(0).click({force: true}).wait(waitTime);
    cy.get(dialogFalse).click().wait(waitTime);
});


Cypress.Commands.add('leaveProject', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(dashboardCreateTask).click().wait(waitTime);
    cy.get(leaveProject).click().wait(waitTime);
    cy.get(dialogTrue).click().wait(waitTime);  
});


Cypress.Commands.add('inviteMember', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    cy.get(dashboardCreateTask).click().wait(waitTime);
    cy.get(inviteMemberInput).click().type(testInvite).wait(waitTime);
    cy.get(inviteMemberButton).click().wait(waitTime);
});









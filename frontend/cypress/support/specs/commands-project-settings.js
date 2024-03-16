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
const testInvite = data.testuser;


// Cancel the removal of a project member
Cypress.Commands.add('projectSettingsCancelDelete', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // navigation to project settings 
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // cancel remove
    cy.get(removeUserButton).eq(2).click({force: true}).wait(waitTime);
    cy.get(dialogFalse).click().wait(waitTime);
});

// Delete a User from the project
Cypress.Commands.add('projectSettingsDeleteUser', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // navigation to project settings 
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // remove user with button
    cy.get(removeUserButton).eq(2).click({force: true}).wait(waitTime);
    cy.get(dialogTrue).click().wait(waitTime);
});

// leave the project
Cypress.Commands.add('leaveProject', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // navigation to project settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // leave the project
    cy.get(leaveProject).click().wait(waitTime);
    cy.get(dialogTrue).click().wait(waitTime);  
});

// invite a Member 
Cypress.Commands.add('inviteMember', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // navigation to project settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // send invatation
    cy.get(inviteMemberInput).click({force: true}).type(testInvite).wait(waitTime);
    cy.get(inviteMemberButton).click().wait(waitTime);
});









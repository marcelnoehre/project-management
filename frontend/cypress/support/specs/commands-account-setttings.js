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
const dashboardCreateTask = '[data-cy=dashboard-app-ACCOUNT_SETTINGS]';;

// constants for user input
const username = data.user.username.admin;
const password = data.user.password.mock;
const mocktext = data.mock.mocktext
const mockpassword = data.mock.mockpassword
const mockinitials = data.mock.mockinitials
const selectedLanguage = 'DE'

// Constants for button inputs
const deleteAccountButton = '[data-cy="delete-account-button"]';
const dialogFalse = '[data-cy="dialog-button-false"]';
const dialogTrue = '[data-cy="dialog-button-true"]';

// Constants for changing account settings
const changeUsername = '[data-cy="username-change"]';
const changeUsernameBtn = '[data-cy="username-change-btn"]';

const changeFullname = '[data-cy="fullname-change"]';
const changeFullnameBtn = '[data-cy="fullname-change-btn"]';

const changeLanguage = '[data-cy="language-change"]';
const changeLanguageDrop ='[data-cy="language-change-dropdown"]'; 
const changeLanguageBtn = '[data-cy="language-change-btn"]';

const changePassword = '[data-cy="password-change"]';
const changePasswordHide = '[data-cy="password-change-hide"]';
const changePasswordBtn = '[data-cy="password-change-btn"]';

const changeInitials = '[data-cy="initials-change"]';
const changeInitialsBtn = '[data-cy="initials-change-btn"]';


// Invalid Inputs
Cypress.Commands.add('invalidInputs', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to account settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Clear input fields 
    cy.get(changeUsername).clear().wait(waitTime);
    cy.get(changeFullname).clear().wait(waitTime);
    cy.get(changePassword).clear().wait(waitTime);
    cy.get(changeInitials).clear().wait(waitTime);
});

// Change the Username
Cypress.Commands.add('changeUsername', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to account settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Change username
    cy.get(changeUsername).clear();
    cy.get(changeUsername).type(mocktext).wait(waitTime);
    cy.get(changeUsernameBtn).click().wait(waitTime);
    cy.get(dialogTrue).click().wait(waitTime);
   
});

// Change the Fullname
Cypress.Commands.add('changeFullname', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to account settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Change Fullname
    cy.get(changeFullname).clear();
    cy.get(changeFullname).type(mocktext).wait(waitTime);
    cy.get(changeFullnameBtn).click().wait(waitTime);
    cy.get(dialogTrue).click().wait(waitTime);
});

// Change the password
Cypress.Commands.add('changePassword', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to account settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Change password
    cy.get(changePassword).click().type(mockpassword).wait(waitTime);
    cy.get(changePasswordHide).click().wait(waitTime);
    cy.get(changePasswordBtn).click().wait(waitTime);
    cy.get(dialogTrue).click().wait(waitTime);

});

// Change the initials
Cypress.Commands.add('changeInitials', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to account settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Change password
    cy.get(changeInitials).click().clear();
    cy.get(changeInitials).click().type(mockinitials).wait(waitTime);
    cy.get(changeInitialsBtn).click().wait(waitTime);
    cy.get(dialogTrue).click().wait(waitTime);
});

// Delete Account
Cypress.Commands.add('deleteAccount', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to account settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Delete Account
    cy.get(deleteAccountButton).click().wait(waitTime);
    cy.get(dialogTrue).click().wait(waitTime);
});














import * as data from '../../fixtures/data.json';

//General constants
const registrationRoute = 'http://localhost:4200/registration';
const waitTime = data.waitTime;
const beDisabled = 'be.disabled';
const beEnabled = 'be.enabled';

// constants to access HTML
const usernameInput = '[data-cy="registration-username"]';
const fullNameInput = '[data-cy="registration-fullName"]';
const languageInput = '[data-cy="registration-language"]';
const passwordInput = '[data-cy="registration-password"]';
const hidePassword = '[data-cy="registration-hide-password"]';
const passwordRepeatInput = '[data-cy="registration-password-repeat"]';
const hidePasswordRepeat = '[data-cy="registration-hide-password-repeat"]';
const registerButton = '[data-cy="registration-submit"]';
const loginLink = '[data-cy="login-link"]';

// constants for user input
const username = data.mocktext;
const fullName = data.user.fullName;
const language = data.user.language;
const password = data.user.password.valid;
const tooShort = data.tooShort;
const invalid = data.invalid;
const invalidPassword = data.user.password.invalid;
const enter = data.enter;

// invalid inputs
Cypress.Commands.add('registrationInvalidUsername', () => {
    cy.visit(registrationRoute);
    cy.get(usernameInput).click({force: true}).type(tooShort).wait(waitTime);
    cy.get(fullNameInput).click({force: true}).type(fullName).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(passwordRepeatInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(hidePasswordRepeat).click().wait(waitTime);
    cy.get(registerButton).should(beDisabled).wait(waitTime);
});

Cypress.Commands.add('registrationInvalidFullName', () => {
    cy.visit(registrationRoute);
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(passwordRepeatInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(hidePasswordRepeat).click().wait(waitTime);
    cy.get(registerButton).should(beDisabled).wait(waitTime);
});

Cypress.Commands.add('registrationInvalidPassword', () => {
    cy.visit(registrationRoute);
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(fullNameInput).click({force: true}).type(fullName).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(tooShort).wait(waitTime);
    cy.get(passwordRepeatInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(hidePasswordRepeat).click().wait(waitTime);
    cy.get(registerButton).should(beDisabled).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(invalidPassword).wait(waitTime);
    cy.get(registerButton).should(beDisabled).wait(waitTime);
});

Cypress.Commands.add('registrationInvalidPasswordRepeat', () => {
    cy.visit(registrationRoute);
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(fullNameInput).click({force: true}).type(fullName).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(passwordRepeatInput).click({force: true}).type(tooShort).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(hidePasswordRepeat).click().wait(waitTime);
    cy.get(registerButton).should(beDisabled).wait(waitTime);
    cy.get(passwordRepeatInput).click({force: true}).type(invalidPassword).wait(waitTime);
    cy.get(registerButton).should(beDisabled).wait(waitTime);
});

// register with blocked username
Cypress.Commands.add('blockedRegistration', () => {
    cy.visit(registrationRoute);
    cy.get(usernameInput).click({force: true}).type(invalid).wait(waitTime);
    cy.get(fullNameInput).click({force: true}).type(fullName).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(passwordRepeatInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(hidePasswordRepeat).click().wait(waitTime);
    cy.get(registerButton).should(beEnabled).wait(waitTime);
    cy.get(registerButton).click().wait(waitTime);
});

// valid registration
Cypress.Commands.add('validRegistration', () => {
    cy.visit(registrationRoute);
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(fullNameInput).click({force: true}).type(fullName).wait(waitTime);
    cy.get(languageInput).click({force: true}).type(language).wait(waitTime).type(enter);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(passwordRepeatInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(hidePasswordRepeat).click().wait(waitTime);
    cy.get(registerButton).should(beEnabled).wait(waitTime);
    cy.get(registerButton).click().wait(waitTime);
});

// redirect login
Cypress.Commands.add('registrationRedirectLogin', () => {
    cy.visit(registrationRoute);
    cy.get(loginLink).click().wait(waitTime);
});

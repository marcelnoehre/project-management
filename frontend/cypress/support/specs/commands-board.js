import * as data from '../../fixtures/data.json';
import 'cypress-drag-drop';

//General constants
const loginRoute = 'http://localhost:4200/login';
const waitTime = data.waitTime;
const beEnabled = data.beEnabled;
const tasktitel = data.taskView.taskViewTitel;
const taskDescription = data.taskView.taskViewDescription;

// Constants to access HTML
const usernameInput = '[data-cy="login-username"]';
const passwordInput = '[data-cy="login-password"]';
const hidePassword = '[data-cy="login-hide-password"]';
const loginButton = '[data-cy="login-submit"]';
const dashboardCreateTask = '[data-cy=dashboard-app-BOARD]';;

// constants for user input
const username = data.user.username.admin;
const password = data.user.password.mock;
const user = data.user.username.owner;
const columFirst = data.taskView.columnFirst;
const taskFirst = data.taskView.taskFirst;
const matoption = data.taskView.matoption;

// Constants for download buttons 
const jsonButton = '[data-cy="json_button"]';
const xmlButton = '[data-cy="xml_button"]';
const ymlButton = '[data-cy="yaml_button"]';
const confirmTaskButton = '[data-cy="confirmTaskBtn"]';
const cancelTaskButton = '[data-cy="cancelTaskBtn"]';
const taskViewTitel = '[data-cy="taskViewTitel"]';
const taskViewDescription = '[data-cy="taskViewDescription"]';
const taskViewAssignedUser = '[data-cy="taskViewAssignedUser"]';


// Click task view and cancel
Cypress.Commands.add('clickTaskCancel', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to account settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Click on first task and cancel
    cy.get(columFirst).as(taskFirst).click().wait(waitTime);
    cy.get(cancelTaskButton).should(beEnabled);
    cy.get(cancelTaskButton).click({ force: true }).wait(waitTime); 
});


Cypress.Commands.add('taskTitleChange', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to account settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Click on first task and change titel
    cy.get(columFirst).as(taskFirst).click().wait(waitTime);
    cy.get(taskViewTitel).click({ force: true }).clear().type(tasktitel).wait(waitTime);
    cy.get(confirmTaskButton).should(beEnabled);
    cy.get(confirmTaskButton).click({ force: true }).wait(waitTime); 
});


Cypress.Commands.add('taskDescriptionChange', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to account settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Click on fist task and change description
    cy.get(columFirst).as(taskFirst).click().wait(waitTime);
    cy.get(taskViewDescription).click({ force: true }).clear().type(taskDescription).wait(waitTime);
    cy.get(confirmTaskButton).should(beEnabled);
    cy.get(confirmTaskButton).click({ force: true }).wait(waitTime); 
});


Cypress.Commands.add('taskAssignedChange', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to account settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Click on fist task and change user
    cy.get(columFirst).as(taskFirst).click().wait(waitTime);
    cy.get(taskViewAssignedUser).click();
    cy.get('mat-option').contains(user).click();
    cy.get(confirmTaskButton).should(beEnabled);
    cy.get(confirmTaskButton).click({ force: true }).wait(waitTime); 
});


// Click all Downloads
Cypress.Commands.add('clickDownloads', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to account settings
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Buttons
    cy.get(jsonButton).click().wait(waitTime);
    cy.get(xmlButton).click().wait(waitTime);
    cy.get(ymlButton).click().wait(waitTime);
});





















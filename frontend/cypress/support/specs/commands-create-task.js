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
const dashboardCreateTask = '[data-cy=dashboard-app-CREATE_TASK]';

// Constants to create task 
const createTaskTitel = '[data-cy="create-task-title"]'
const createTaskDescription = '[data-cy="create-task-description"]';
const assignTask = '[data-cy="create-task-assign"]';
const assignState = '[data-cy="create-task-state"]';
const createTask = '[data-cy="create-task-submit"]';

// constants for user input
const username = data.user.username.owner;
const password = data.user.password.mock;
const taskTitel = data.task.taskTitel;
const taskDescription = data.task.taskDescription;
const state = data.task.taskstate.toDo;
const enter = data.enter;


// Create invalid Task
Cypress.Commands.add('createTaskInvalid', () => {
    cy.visit(loginRoute);
    // login
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);

    // Navigation to module create task
    cy.get(dashboardCreateTask).click().wait(waitTime);

    // Leave titel and description blank
    cy.get(assignTask).click({force: true}).type(username).wait(waitTime).type(enter);
    cy.get(assignState).click({force: true}).type(state).wait(waitTime).type(enter);
});


// Create valid Task
Cypress.Commands.add('createTaskValid', () => {
    cy.visit(loginRoute);
    // login
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);

    // Navigation to module create task
    cy.get(dashboardCreateTask).click().wait(waitTime);

    //Fill field with valid input
    cy.get(createTaskTitel).click({force: true}).type(taskTitel).wait(waitTime);
    cy.get(createTaskDescription).click({force: true}).type(taskDescription).wait(waitTime);
    cy.get(assignTask).click({force: true}).type(username).wait(waitTime).type(enter);
    cy.get(assignState).click({force: true}).type(state).wait(waitTime).type(enter);
    cy.get(createTask).click().wait(waitTime);
});

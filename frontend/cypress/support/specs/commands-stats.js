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
const dashboardCreateTask = '[data-cy=dashboard-app-STATS]';
const regenerateStats = '[data-cy="regenerate-stats"]';

// Constants referesh buttons
const refreshPersonalStats = '[data-cy="refresh-personal-stats"]';
const refreshStatLeader = '[data-cy="refresh-stat-leader"]';
const refreshStats = '[data-cy="refresh-stats"]';
const refreshTaskAmout = '[data-cy="refresh-task-amout"]';
const refreshAvgTime = '[data-cy="refresh-AvgTime"]';
const refreshProgressWork = '[data-cy="refresh-progress-work"]';
const refreshProgressTask = '[data-cy="refresh-progress-task"]';
const refreshRoadmap = '[data-cy="refresh-roadmap"]';

// Constants charts
const chartTaskAmount = '[data-cy="task-amount-chart"]'
const chartAvgTime = '[data-cy="avg-time-chart"]'

// constants for user input
const username = data.user.username.owner;
const password = data.user.password.mock;


// Testing all refresh buttons on the statboard
Cypress.Commands.add('refreshButtonsAll', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to Stats
    cy.get(dashboardCreateTask).click().wait(waitTime);
    // Clicking and refreshing all stats 
    cy.get(refreshPersonalStats).click().wait(waitTime);
    cy.get(refreshStatLeader).click().wait(waitTime);
    cy.get(refreshStats).click().wait(waitTime);
    cy.get(refreshTaskAmout).click().wait(waitTime);
    cy.get(refreshAvgTime).click().wait(waitTime);
    cy.get(refreshProgressWork).click().wait(waitTime);
    cy.get(refreshProgressTask).click().wait(waitTime);
    cy.get(refreshRoadmap).click().wait(waitTime);
});

// Testing responsiveness of charts
Cypress.Commands.add('chartClicks', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to stats
    cy.get(dashboardCreateTask).click().wait(1200);
    // Clicking on the charts
    cy.get(chartTaskAmount).click().wait(waitTime);
    cy.get(chartAvgTime).click().wait(waitTime);
});

// Testing the Button: Regenarate all statistics
Cypress.Commands.add('regenerateAllStats', () => {
    cy.visit(loginRoute);
    // valid credentials
    cy.get(usernameInput).click({force: true}).type(username).wait(waitTime);
    cy.get(passwordInput).click({force: true}).type(password).wait(waitTime);
    cy.get(hidePassword).click().wait(waitTime);
    cy.get(loginButton).should(beEnabled);
    cy.get(loginButton).click().wait(waitTime);
    // Navigation to Stats
    cy.get(dashboardCreateTask).click().wait(waitTime);
    //Click of button:regenerate all statistics
    cy.get(regenerateStats).click().wait(waitTime);
});







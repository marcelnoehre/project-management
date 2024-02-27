// Cancel deletion of user inside project
describe('Open the project settings an cancel the deletion', () => {
  sessionStorage.clear();
    it('Should cancel the removal of a member with cancel button', () => {
        cy.viewport(1600, 900);
        cy.projectSettingsCancelDelete();
        cy.url().should('include', '/settings/project');
    });
});

// Delete existing user from project
describe('Delete a user from project', () => {
  sessionStorage.clear();
    it('Should delete a user from list', () => {
        cy.viewport(1600, 900);
        cy.projectSettingsDeleteUser();
        cy.url().should('include', '/settings/project');
    });
});

// Leave a project from the project settings
describe('Leave the project', () => {
  sessionStorage.clear();
    it('Should leave the project and start at the login screen', () => {
        cy.viewport(1600, 900);
        cy.leaveProject();
        cy.url().should('include', '/login');
    });
});

// Invite a User by his username
describe('Invite a user with his username', () => {
  sessionStorage.clear();
    it('Should send back information in the snackbar', () => {
        cy.viewport(1600, 900);
        cy.inviteMember();
        cy.url().should('include', '/settings/project');
    });
});











describe('Should delete a user from project settings', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Delete a user from project settings', () => {
        cy.viewport(1600, 900);
        cy.projectSettingsDeleteUser();
        cy.url().should('include', '/settings/project');
    });
});

describe('Open the project settings an cancel the deletion', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Should cancel the deletion of a member in the dialog with cancel', () => {
        cy.viewport(1600, 900);
        cy.projectSettingsCancelDelete();
        cy.url().should('include', '/settings/project');
    });
});

describe('Leave the project', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Should leave the project and start at the login screen', () => {
        cy.viewport(1600, 900);
        cy.leaveProject();
        cy.url().should('include', '/login');
    });
});


describe('Invite a user with his username', () => {
  //Login User without assigned Project + creating a test project
  sessionStorage.clear();
    it('Should send back information in the snackbar', () => {
        cy.viewport(1600, 900);
        cy.inviteMember();
        cy.url().should('include', '/settings/project');
    });
});











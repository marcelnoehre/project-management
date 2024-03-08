// Test notifcation toggle
describe('Notification button to change the status', () => {
  sessionStorage.clear();
    it('should toggle on and off', () => {
        cy.viewport(1600, 900);
        cy.notificationToggle();
    });
});

// Delete notifiaction inside notification feed
describe('Notifications feed to delete all notifications', () => {
  sessionStorage.clear();
    it('Should delete 2 notifications from dialog', () => {
        cy.viewport(1600, 900);
        cy.notificationDialog();
    });
});

// Testing logout 
describe('Logout in toolbars', () => {
  sessionStorage.clear();
    it('Should lead to login page', () => {
        cy.viewport(1600, 900);
        cy.toolbarLogout();
    });
});















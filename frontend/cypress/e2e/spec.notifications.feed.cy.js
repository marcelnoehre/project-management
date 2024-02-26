describe('Should use the notification button to change the status', () => {
  sessionStorage.clear();
    it('should toggle on and off', () => {
        cy.viewport(1600, 900);
        cy.notificationToggle();
    });
});

describe('Should open the notification feed and delete all notifications', () => {
  sessionStorage.clear();
    it('2 notification should be delete so there are no messages', () => {
        cy.viewport(1600, 900);
        cy.notificationDialog();
    });
});

describe('Should open the notification feed and delete all notifications', () => {
  sessionStorage.clear();
    it('2 notification should be delete so there are no messages', () => {
        cy.viewport(1600, 900);
        cy.toolbarLogout();
    });
});















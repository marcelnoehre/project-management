// Invalid Inputs
describe('Testing account delete', () => {
  sessionStorage.clear();
    it('Should return a snackbar information', () => {
        cy.viewport(1600, 900);
        cy.invalidInputs(); 
    });
});

// Change username
describe('Change and confirm Input of new username', () => {
  sessionStorage.clear();
    it('Should redirect to login screen', () => {
        cy.viewport(1600, 900);
        cy.changeUsername();
        
    });
});

// Change fullname
describe('Change and confirm Input of new fullname', () => {
  sessionStorage.clear();
    it('Should show update fullname in toolbar', () => {
        cy.viewport(1600, 900);
        cy.changeFullname();
      
    });
});

// Change passwort
describe('Change and confirm Input of new password', () => {
  sessionStorage.clear();
    it('Should show update in toolbar', () => {
        cy.viewport(1600, 900);
        cy.changePassword();
      
    });
});

// Change initials
describe('Change and confirm Input of new password', () => {
  sessionStorage.clear();
    it('Should show update in toolbar', () => {
        cy.viewport(1600, 900);
        cy.changeInitials();
      
    });
});

// Delete Account
describe('Testing account delete', () => {
  sessionStorage.clear();
    it('Should return a snackbar information', () => {
        cy.viewport(1600, 900);
        cy.deleteAccount();
      
    });
});









  



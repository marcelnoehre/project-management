// Invalid inputs
describe('Invalid changes for account settings', () => {
  sessionStorage.clear();
    it('Should give validation in input fields', () => {
        cy.viewport(1600, 900);
        cy.invalidInputs(); 
    });
});




describe('Valid Changes for account settings', () => {
// Change username
  sessionStorage.clear();
    it('Should change and confrim username', () => {
        cy.viewport(1600, 900);
        cy.changeUsername();
        
    });

// Change fullname
  sessionStorage.clear();
    it('Should change and confrim fullname', () => {
        cy.viewport(1600, 900);
        cy.changeFullname();
      
    });

// Change the language
  sessionStorage.clear();
    it('Should change language to "Deutsch"', () => {
        cy.viewport(1600, 900);
        cy.changeLanguage(); 
    });


// Change passwort
  sessionStorage.clear();
    it('Should change password', () => {
        cy.viewport(1600, 900);
        cy.changePassword();
      
    });

// Change initials
  sessionStorage.clear();
    it('Should change and update initials', () => {
        cy.viewport(1600, 900);
        cy.changeInitials();
      
    });

// Profile picture
  sessionStorage.clear();
    it('Should change profile picture', () => {
        cy.viewport(1600, 900);
        cy.changePicture(); 
    });

// change colour
  sessionStorage.clear();
    it('Should change colour of icon in the toolbar', () => {
        cy.viewport(1600, 900);
        cy.changeColour(); 
    });


// Delete Account
  sessionStorage.clear();
    it('Should delete the account', () => {
        cy.viewport(1600, 900);
        cy.deleteAccount();
    });
});









  



// Invalid Inputs
describe('Testing change of profile picture', () => {
  sessionStorage.clear();
    it('Should change user icon', () => {
        cy.viewport(1600, 900);
        cy.changePicture(); 
    });
});


describe('Testing change of colour', () => {
  sessionStorage.clear();
    it('Should change colour of icon in the toolbar', () => {
        cy.viewport(1600, 900);
        cy.changeColour(); 
    });
});


// Invalid inputs
describe('Testing validation of inputfields', () => {
  sessionStorage.clear();
    it('Should give validation alert', () => {
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


// Change the language
describe('Testing change of language to Deutsch', () => {
  sessionStorage.clear();
    it('Should change lang to Deutsch', () => {
        cy.viewport(1600, 900);
        cy.changeLanguage(); 
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









  



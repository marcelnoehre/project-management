// Change Titel in Task in Detail View
describe('change assigned User in taskview', () => {
  sessionStorage.clear();
    it('Should open task view and confirm assined user change', () => {
        cy.viewport(1600, 900);
        cy.taskAssignedChange(); 
    });
});


// Change Titel in Task in Detail View
describe('change titel in taskview', () => {
  sessionStorage.clear();
    it('Should open task view and confirm title change', () => {
        cy.viewport(1600, 900);
        cy.taskTitleChange(); 
    });
});


// Cancel Change on Task in Detail View
describe('change description in Taskview', () => {
  sessionStorage.clear();
    it('Should open taksview and change description', () => {
        cy.viewport(1600, 900);
        cy.taskDescriptionChange(); 
    });
});


// Cancel Change on Task in Detail View
describe('Testing detial view of task and cancel Taskview', () => {
  sessionStorage.clear();
    it('Should open and close taskview', () => {
        cy.viewport(1600, 900);
        cy.clickTaskCancel(); 
    });
});


// Invalid Inputs
describe('Testing diffrent download buttons', () => {
  sessionStorage.clear();
    it('Should start the diffrent downloads', () => {
        cy.viewport(1600, 900);
        cy.clickDownloads(); 
    });
});











  



// Cancel change on task in detail view
describe('Testing detail view of task and cancel dialog', () => {
  sessionStorage.clear();
    it('Should open and close detail view', () => {
        cy.viewport(1600, 900);
        cy.clickTaskCancel(); 
    });
});


// change titel in task in detail view
describe('change title in detail view', () => {
  sessionStorage.clear();
    it('Should open task view and confirm title change', () => {
        cy.viewport(1600, 900);
        cy.taskTitleChange(); 
    });
});


// change description on task in detail view
describe('change description in detail view', () => {
  sessionStorage.clear();
    it('Should open detail view and change description', () => {
        cy.viewport(1600, 900);
        cy.taskDescriptionChange(); 
    });
});


// change assigned user of a task in detail view
describe('change assigned User in detail view', () => {
  sessionStorage.clear();
    it('Should open detail view and confirm assined user change', () => {
        cy.viewport(1600, 900);
        cy.taskAssignedChange(); 
    });
});


// Downloads
describe('Testing diffrent download buttons', () => {
  sessionStorage.clear();
    it('Should start the diffrent downloads', () => {
        cy.viewport(1600, 900);
        cy.clickDownloads(); 
    });
});











  



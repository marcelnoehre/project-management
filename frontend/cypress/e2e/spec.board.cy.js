// Invalid changes 
describe('Invalid changes in detail view', () => {
  // Cancel change on task in detail view
  sessionStorage.clear();
    it('Should clear task information and cancel changes', () => {
        cy.viewport(1600, 900);
        cy.clickTaskCancel(); 
    });
});


//Valid changes
describe('Valid changes in detail view', () => {
  // change titel in task in detail view
  sessionStorage.clear();
    it('Should confirm title change', () => {
        cy.viewport(1600, 900);
        cy.taskTitleChange(); 
    });

// change description on task in detail view
  sessionStorage.clear();
    it('Should confirm description change', () => {
        cy.viewport(1600, 900);
        cy.taskDescriptionChange(); 
    });


// change assigned user of a task in detail view
  sessionStorage.clear();
    it('Should confirm assined user change', () => {
        cy.viewport(1600, 900);
        cy.taskAssignedChange(); 
    });
});


// Downloads
describe('Download buttons', () => {
  sessionStorage.clear();
    it('Should start downloads for json, xml yaml', () => {
        cy.viewport(1600, 900);
        cy.clickDownloads(); 
    });
});











  



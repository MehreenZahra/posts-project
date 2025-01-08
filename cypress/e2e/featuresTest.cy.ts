describe('E2E Tests for Blog Application', () => {
    before(() => {
      // This will run once before all tests
      cy.visit('http://localhost:3000/signup');
      cy.get('input[name="name"]').type('testUser');
      cy.get('input[name="email"]').type('testUser@gmail.com');
      cy.get('input[name="password"]').type('testUser123');
      cy.get('button[type="submit"]').click();
      
      // Verify that the user is redirected to the home page
      cy.url().should('include', '/home');
    });
  
    it('should allow a user to add & edit a post', () => {
      cy.get('input[aria-label="title"]').type('My First Post');
      cy.get('textarea[aria-label="content"]').type('This is the content of my first post.');
      cy.get('button').contains('Add Post').click();
      cy.contains('My First Post').should('exist');
        // Step 2: Open the edit dialog
    cy.get('[data-testid="more-button"]').click(); // Click on the MoreVertical icon
    cy.contains('Edit').click(); // Click on the Edit option

    // Step 3: Edit the post
    cy.get('input[aria-label="edit title"]').clear().type('My Updated Post'); // Clear and update title
    cy.get('textarea[aria-label="edit content"]').clear().type('This is the updated content of my post.'); // Clear and update content

    // Step 4: Save the changes
    cy.get('button').contains('Save').click();

    // Step 5: Verify the changes
    cy.contains(/y Updated Post/i).should('exist');
    cy.contains(/This is the updated content of my post./i).should('exist');


    // allow a user to add comment on this post
    cy.contains(/My Updated Post/i).click();
    cy.get('button').contains('Comments').click();
      cy.get('textarea[aria-label="Add Comment"]').type('This is a comment.');
      cy.get('[data-testid="add-comment-button"]').click(); 
      cy.contains('This is a comment.').should('exist');
      
      


      //allow user to open a post in new page 
      cy.contains('View').click();





 //allow user to like the post 
  cy.get('button').contains('Like').click(); 
 cy.wait(500).contains('Like (1)').should('exist');




//allow user to edit the comment on the post 
 cy.contains('This is a comment').click();
cy.get('[data-testid="comment-options-button"]').click();

 cy.contains('Edit').click();
 cy.get('textarea[aria-label="Edit Comment"]').focus().clear().type('This is an updated comment.');

 cy.get('button').contains('Save').click();




 //allow user to delete this comment
 cy.contains('This is an updated comment').click();
 cy.get('[data-testid="comment-options-button"]').click();

 cy.contains('Delete').click();

 cy.get('[data-testid="delete-comment-button"]').click();



//dont allow user to navigate to /
 cy.visit('http://localhost:3000');
 cy.url().should('include', '/home');



// allow users to delete the added post
cy.contains('My Updated Post').click();
cy.get('[data-testid="more-button"]').click();
cy.contains('Delete').click(); // Click on the Delete option


cy.get('[data-testid="delete-post-button"]').click();
    
});

    
  });
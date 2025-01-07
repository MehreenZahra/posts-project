// describe('Posts Context', () => {
//   it('fetches posts successfully', () => {
//     cy.visit('/home');
//     cy.wait('@posts').then((xhr) => {
//         expect(xhr.response.body).to.have.length(100); // assuming 100 posts are fetched
//       }); // assuming 100 posts are fetched
//   });

//   it('renders post list with correct number of posts', () => {
//     cy.visit('/home');
//     cy.get('.post-list .post').should('have.length', 100); // assuming 100 posts are fetched
//   });

//   it('renders post list with correct post data', () => {
//     cy.visit('/home');
//     cy.get('.post-list .post').each((post, index) => {
//       cy.get(post).find('.title').should('contain', `Post ${index + 1}`);
//       cy.get(post).find('.content').should('contain', `quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto`);
//     });
//   });

//   it('handles error when fetching posts', () => {
//     // simulate network error
//     cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts', {
//       forceNetworkError: true,
//     });
//     cy.visit('/home');
//     cy.get('.error-message').should('be.visible');
//   });

//   it('displays loading indicator while fetching posts', () => {
//     cy.visit('/home');
//     cy.get('.loading-indicator').should('be.visible');
//     cy.wait('@posts'); // wait for posts to be fetched
//     cy.get('.loading-indicator').should('not.be.visible');
//   });
// });

describe('Home Page', () => {
  it('fetches posts successfully', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts', {
      as: 'posts',
    }).as('posts');
    cy.visit('http://localhost:3000/home');
    cy.wait('@posts').then((xhr) => {
      if (xhr.response) {
        expect(xhr.response.body).to.have.length(100); // assuming 100 posts are fetched
      } else {
        expect.fail('No response received');
      }
    });
  });
});
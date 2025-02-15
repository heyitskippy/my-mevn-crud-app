// https://on.cypress.io/api

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'You did it!')
  })

  const NODE_ENV = Cypress.env('NODE_ENV')

  it(`check /api, NODE_ENV=${NODE_ENV}`, () => {
    cy.visit('/')
    cy.get('#api').click()

    if (NODE_ENV === 'production') {
      cy.origin(Cypress.env('VITE_API'), () => {
        cy.contains('body', "It's API!")
      })
    } else {
      cy.contains('body', "It's API!")
    }
  })
})

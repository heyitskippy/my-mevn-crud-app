/// <reference types="cypress" />
const API = Cypress.env('VITE_API')
const STORE_KEY = Cypress.env('VITE_STORE_KEY')

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[name=email]').type(email)
  cy.get('input[name=password]').type(password, { log: false })
  cy.get('button[type=submit]').click()
})

Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  cy.request('POST', `${API}/auth/login`, { email, password }).then((res) => {
    window.localStorage.setItem(
      STORE_KEY,
      JSON.stringify({
        accessToken: res.body.accessToken,
        currentUser: res.body.user,
      }),
    )
  })
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      loginByApi(email: string, password: string): Chainable<void>
    }
  }
}

export {}

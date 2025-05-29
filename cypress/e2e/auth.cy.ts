const resource = 'auth'
const API = Cypress.env('VITE_API')
const STORE_KEY = Cypress.env('VITE_STORE_KEY')

describe(resource, () => {
  const ADMIN_EMAIL = Cypress.env('VITE_ADMIN_EMAIL')
  const ADMIN_PASSWORD = Cypress.env('VITE_ADMIN_PASSWORD')

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()

    cy.intercept('POST', `${API}/${resource}/login`).as('login')
    cy.intercept('GET', `${API}/${resource}/refresh`).as('refresh')

    cy.visit('/login')
  })

  it('should login with valid credentials', () => {
    cy.get('input[name=email]').type(ADMIN_EMAIL)
    cy.get('input[name=password]').type(ADMIN_PASSWORD)
    cy.get('button[type=submit]').click()

    cy.intercept('POST', '**/login').as('login')
    cy.wait('@login').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200)

      cy.window()
        .its('localStorage')
        .invoke('getItem', STORE_KEY)
        .then((storage) => {
          const parsed = JSON.parse(storage ?? '{}')

          expect(parsed.accessToken).to.be.a('string')
          expect(parsed.currentUser).to.be.an('object')
        })

      cy.url().should('include', '/users/list')
    })
  })

  it('should fail login with invalid credentials', () => {
    cy.get('input[name=email]').type('wrong@email.com')
    cy.get('input[name=password]').type('wrongpassword')
    cy.get('button[type=submit]').click()

    cy.wait('@login').then((interception) => {
      expect(interception.response?.statusCode).to.eq(401)
      expect(interception.response?.body.errors.server).to.exist

      cy.url().should('include', '/login')
    })
  })

  it('should logout and clear localStorage', () => {
    cy.loginByApi(ADMIN_EMAIL, ADMIN_PASSWORD)

    cy.getCookie('refreshToken')
      .should('exist')
      .then((cookie) => {
        expect(cookie?.value).to.not.equal(null)
      })

    cy.visit('/users/list')
    cy.get('[data-test="logout"]').click()

    cy.url().should('include', '/login')

    cy.window()
      .its('localStorage')
      .invoke('getItem', STORE_KEY)
      .then((storage) => {
        const parsed = JSON.parse(storage ?? '{}')

        expect(parsed.accessToken).to.be.null
        expect(parsed.currentUser).to.be.null
      })
  })

  describe('token refresh scenarios', () => {
    beforeEach(() => {
      cy.loginByApi(ADMIN_EMAIL, ADMIN_PASSWORD)

      cy.window()
        .its('localStorage')
        .invoke('getItem', STORE_KEY)
        .then((storage) => {
          const parsed = JSON.parse(storage ?? '{}')

          expect(parsed.accessToken).to.be.a('string')
          cy.wrap(parsed.accessToken).as('initialToken')
        })
    })

    it('should return same token when valid token provided', () => {
      cy.get('@initialToken').then((subject) => {
        const initialToken = subject.toString()

        cy.request({
          url: `${API}/${resource}/refresh`,
          headers: {
            Authorization: `Bearer ${initialToken}`,
          },
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.accessToken).to.eq(initialToken)
        })
      })
    })

    it('should return initial token when invalid token provided', () => {
      cy.get('@initialToken').then((subject) => {
        const initialToken = subject.toString()

        cy.request({
          url: `${API}/${resource}/refresh`,
          headers: {
            Authorization: `Bearer invalid.token`,
          },
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.accessToken).to.eq(initialToken)
        })
      })
    })

    it('should return initial token when no token but valid refresh cookie', () => {
      cy.get('@initialToken').then((subject) => {
        const initialToken = subject.toString()

        cy.request({
          url: `${API}/${resource}/refresh`,
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.accessToken).to.eq(initialToken)
        })
      })
    })

    it('should fail when no token and no refresh cookie', () => {
      cy.clearCookie('refreshToken')

      cy.request({
        url: `${API}/${resource}/refresh`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body.errors.server).to.exist
      })
    })
  })
})

describe('404', () => {
  const API = Cypress.env('VITE_API')
  const STORE_KEY = Cypress.env('VITE_STORE_KEY')
  const ADMIN_EMAIL = Cypress.env('VITE_ADMIN_EMAIL')
  const ADMIN_PASSWORD = Cypress.env('VITE_ADMIN_PASSWORD')

  let accessToken: string | null

  beforeEach(() => {
    cy.loginByApi(ADMIN_EMAIL, ADMIN_PASSWORD)

    cy.window()
      .its('localStorage')
      .invoke('getItem', STORE_KEY)
      .then((storage) => {
        const { accessToken: token } = JSON.parse(storage ?? '{}')

        accessToken = token
      })
  })

  it(`${API} request should return 404 error`, () => {
    cy.request({
      url: API,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body).to.have.property('errors')
      expect(response.body.errors).to.have.property('server', '404: not found')
    })
  })

  it(`${API}/sba request should return 404 error`, () => {
    cy.request({
      url: `${API}/sba`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body).to.have.property('errors')
      expect(response.body.errors).to.have.property('server', '404: not found')
    })
  })

  it(`${API}/users/aa/aa request should return 404 error`, () => {
    cy.request({
      url: `${API}/users/aa/aa`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body).to.have.property('errors')
      expect(response.body.errors).to.have.property('server', '404: not found')
    })
  })

  it('visiting of /user should show a 404 page', () => {
    cy.visit('/user')
    cy.url().should('include', '/user')

    cy.contains('h1', '404')
  })
})

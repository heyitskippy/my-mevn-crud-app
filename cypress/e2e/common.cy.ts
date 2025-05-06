describe('404', () => {
  const API = Cypress.env('VITE_API')

  it(`${API} request should return 404 error`, () => {
    cy.request({ url: API, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body).to.have.property('errors')
      expect(response.body.errors).to.have.property('server', '404: not found')
    })
  })

  it(`${API}/sba request should return 404 error`, () => {
    cy.request({ url: `${API}/sba`, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body).to.have.property('errors')
      expect(response.body.errors).to.have.property('server', '404: not found')
    })
  })

  it(`${API}/users/aa/aa request should return 404 error`, () => {
    cy.request({ url: `${API}/users/aa/aa`, failOnStatusCode: false }).then((response) => {
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

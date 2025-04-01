import { faker } from '@faker-js/faker'

describe('users API', () => {
  it("get users' list", () => {
    cy.visit('/users/list')
    cy.contains('h1', 'Users')

    cy.get('[data-test="cell"]').should('have.length.gt', 0)
  })

  it('get user by id', () => {
    cy.visit('/users/list')
    cy.get('[data-test="cell"]').first().click()

    cy.contains('h1', 'User: edit')

    cy.get('input[name="email"]').should(($input) => {
      expect(!!$input.val()).to.be.true
    })
  })

  it('create user', () => {
    const user = {
      fullName: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
    }

    cy.visit('/users/list')
    cy.get('[name="create"]').click()

    cy.contains('h1', 'User: create')

    cy.get('input[name="email"]').type(user.email)
    cy.get('input[name="fullName"]').type(user.fullName)
    cy.get('.select').click()
    cy.get('.items div').first().click()

    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/users/list')

    cy.get('.table-row-group > .table-row').first().should('have.class', 'blue')

    cy.get('.table-row-group > .table-row').first().find('[name="save"]').click({ force: true })

    cy.get('.table-row-group > .table-row').first().should('have.class', 'green')
    cy.get('.table-row-group > .table-row').first().contains(user.email)
    cy.get('.table-row-group > .table-row').first().contains(user.fullName)
  })

  it('update user', () => {
    const fullName = faker.person.fullName()

    cy.visit('/users/list')
    cy.get('[data-test="cell"]').first().click()

    cy.get('button[type="submit"]').should('be.disabled')

    cy.get('input[name="fullName"]').clear()
    cy.get('input[name="fullName"]').type(fullName)
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/users/list')

    cy.get('.table-row-group > .table-row').first().should('have.class', 'yellow')

    cy.get('.table-row-group > .table-row').first().find('[name="save"]').click({ force: true })

    cy.get('.table-row-group > .table-row').first().should('have.class', 'green')
    cy.get('.table-row-group > .table-row').first().contains(fullName)
  })

  it('delete user', () => {
    cy.visit('/users/list')

    cy.get('[data-test-key="r-0-c-fullName"]').then(($cell) => {
      const fullName = $cell.text()

      cy.get('[data-test="cell"]').first().click()

      cy.get('button[type="button"]').click()

      cy.url().should('include', '/users/list')

      cy.get('.table-row-group > .table-row').first().should('have.class', 'red')
      cy.get('.table-row-group > .table-row').first().contains(fullName)

      cy.get('.table-row-group > .table-row').first().find('[name="delete"]').click({ force: true })
    })
  })
})

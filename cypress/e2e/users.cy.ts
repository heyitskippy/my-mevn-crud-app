import { faker } from '@faker-js/faker'

describe('users', () => {
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
      fullName: faker.person.fullName().replace("'", ' '),
      email: faker.internet.email().toLowerCase(),
      password: '!1' + faker.internet.password({ length: 6 }),
    }

    cy.visit('/users/list')
    cy.get('[name="create"]').click()

    cy.contains('h1', 'User: create')

    cy.get('input[name="email"]').type(user.email)
    cy.get('input[name="fullName"]').type(user.fullName)
    cy.get('input[name="password"]').type(user.password)
    cy.get('.select').click()
    cy.get('.items div').first().click()

    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/users/list')

    cy.get('.my-table-row').first().should('have.class', 'blue')

    cy.get('.my-table-row').first().find('[name="save"]').click({ force: true })
    cy.get('.my-table-row').first().should('have.class', 'green')

    cy.get('.my-table-row').first().contains(user.email)
    cy.get('.my-table-row').first().contains(user.fullName)
  })

  it('update user', () => {
    const fullName = faker.person.fullName().replace("'", ' ')
    const password = '!1' + faker.internet.password({ length: 6 })

    cy.visit('/users/list')
    cy.get('[data-test="cell"]').first().click()

    cy.get('button[type="submit"]').should('be.disabled')

    cy.get('input[name="fullName"]').clear()
    cy.get('input[name="fullName"]').type(fullName)

    cy.get('input[name="password"]').type(password)

    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/users/list')

    cy.get('.my-table-row').first().should('have.class', 'yellow')

    cy.get('.my-table-row').first().find('[name="save"]').click({ force: true })
    cy.get('.my-table-row').first().should('have.class', 'green').contains(fullName)
  })

  it('delete user', () => {
    cy.visit('/users/list')

    cy.get('[data-test-key="r-0-c-fullName"]').then(($cell) => {
      const fullName = $cell.text()

      cy.get('[data-test="cell"]').first().click()

      cy.get('button[type="button"]').click()

      cy.url().should('include', '/users/list')

      cy.get('.my-table-row').first().should('have.class', 'red').contains(fullName)
      cy.get('.my-table-row').first().find('[name="delete"]').click({ force: true })
    })
  })

  it('create and update user at the same time', () => {
    cy.visit('/users/list')

    cy.get('[data-test="cell"]').first().click()

    const fullName = faker.person.fullName().replace("'", ' ')

    cy.get('input[name="fullName"]').clear().type(fullName)
    cy.get('button[type="submit"]').click()

    cy.get('.my-table-row').first().should('have.class', 'yellow').contains(fullName)

    cy.get('[name="create"]').click()

    const user = {
      fullName: faker.person.fullName().replace("'", ' '),
      email: faker.internet.email().toLowerCase(),
      password: '!1' + faker.internet.password({ length: 6 }),
    }

    cy.get('input[name="email"]').type(user.email)
    cy.get('input[name="fullName"]').type(user.fullName)
    cy.get('input[name="password"]').type(user.password)
    cy.get('.select').click()
    cy.get('.items div').first().click()

    cy.get('button[type="submit"]').click()

    cy.get('.my-table-row').first().should('have.class', 'blue')

    cy.get('.my-table-row').first().contains(user.email)
    cy.get('.my-table-row').first().contains(user.fullName)

    cy.get('button[name="confirm"]').click()
    cy.get('.my-table-row.green').should('have.length', 2)
  })
})

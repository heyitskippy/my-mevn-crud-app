# My MEVN CRUD App (Client + Server)

— MongoDB, Express, Vue, Node;
— Vite, Vitest, Cypress, TailwindCSS;
— Client and Server share the same package.json, .env, etc.

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Run Unit & Integration Tests with [Vitest](https://vitest.dev/)

```sh
yarn test
```

### Coverage with [Vitest](https://vitest.dev/)

```sh
yarn coverage
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

Development server:

```sh
yarn test:e2e:dev
```

Production build:

```sh
yarn build
yarn test:e2e
```

### Prepare MongoDB with Docker for Development

```sh
yarn prepare:mongo:dev
```

Check package.json scripts for more.

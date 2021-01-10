# agogpixel

Monorepo for AgogPixel.

## Projects

A given project's location within the monorepo is determined via its project 'type'.

### Applications

Applications located in `apps/`. See the applications [README](./apps/README.md) for more information.

### Libraries

Libraries located in `libs/`. See the libraries [README](./libs/README.md) for more information.

### Workspace Tools

Workspace tools located in `tools/`. See the workspace tools [README](./tools/README.md) for more information.

### Docker Stand-Alone

Docker stand-alone projects located in `docker/`. See the docker stand-alone [README](./docker/README.md) for more information.

## NX Information

This project was generated using [Nx](https://nx.dev).

### Add Capabilities

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/nx-community) you could add.

### Generate Application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

### Generate Library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications. They can be imported from `@agogpixel/mylib`.

### Development Server

Run `nx serve my-app` for a dev server. Navigate to [http://localhost:4200/](http://localhost:4200/). The app will automatically reload if you change any of the source files.

### Code Scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

### Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Unit Tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

### E2E Tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

### Workspace Dependencies

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

# KanBan
A project management system for efficient team collaboration. This system enables the creation and management of teams with a basic permission system that allows tasks to be assigned and processed. The visualisation of the Kanban board simplifies the tracking of tasks, while a statistics view provides insights into the team's workflow. An initially basic solution that provides the most important functionalities for a project management.

# Frontend

Start the production mode:

```
npm run start:prod
```

Start the development mode:

```
npm run start:dev
```

Start the mock mode:

```
npm run start:mock
```

## Frontend: Unit-Testing
* Chrome installation required
* Runs in an isolated test environment

<br>

Run unit tests:

```
npm run test
```

Run unit tests headless:

```
npm run test-headless
```

Calculate coverage rate:

```
npm run test-coverage
```

## Frontend: E2E-Testing
* Chrome installation required
* The frontend must be running in the 'mock mode'
* Runs in an isolated mock environment

Run E2E tests:

```
npm run e2e
```

Run E2E tests headless:

```
npm run e2e-headless
```

<br>

# Backend

Start the backend server:

```
npm run start
```
A Swagger documentation of the available endpoints can be found at `/api-docs`

<br>

## Backend: Unit-Testing
Run unit tests:

```
npm run test
```

Calculate coverage rate:

```
npm run test-coverage
```
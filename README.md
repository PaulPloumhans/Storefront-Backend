#  Udacity Full Stack javascript developer - Storefront Backend

This is the second project of the UDacity Full Stack Javascript Developer Nanodegree program: Storefront Backend.

It consists of an Express server, combined with a Postgres database, that exposes an API for a storefront backend. Users' passwords are stored encrypted in the database, and accessing some endpoints requires a JWT tokenare restrictedencAll functions to access the Postgres database, and all the API endpoints have associated unit tests. 

The starting point for this project is the repository available at: https://github.com/udacity/nd0067-c2-creating-an-api-with-postgresql-and-express-project-starter

# Implementation

Key points:
* Uses Express as web server
* Uses Postgres for the SQL database
* Uses bcrypt for password encryption
* Uses JWT for authorization
* Uses Jasmine and supertest for unit tests
* Development done with TypeScript to reduce errors

# Deployment

## Setting up the Postgres database
In order to run this app you need a properly configured Postgres database. For this, you need a Postgres server running on your machine (see for exemple https://www.postgresql.org/).

Once Postgres is available on your computer, you need to execute the following steps:
- Create the user `storefront_user` with password `7kJ3DDpqnHe3Qx`
- Create the databases `storefront_backend` and `storefront_backend_test`, for development and testing respectively
- Grant all privileges on the databases to the user `storefront_user`

This can be done with the following commands, once you enter `psql` as admin (or root):

First create the user by running in the psql command line:
```
CREATE USER storefront_user with password '7kJ3DDpqnHe3Qx';
```
Then create the tables for development and testing
```
CREATE DATABASE storefront_backend;
CREATE DATABASE storefront_backend_test;
```
Finally, grant `storefront_user` access to these databases
```
GRANT ALL PRIVILEGES ON DATABASE storefront_backend TO storefront_user;
GRANT ALL PRIVILEGES ON DATABASE storefront_backend_test TO storefront_user;
```

## App Installation
The required packages can be installed using
`yarn`

## App Building
To build this application use
`yarn run build`

## Dependencies and versions used

The project depends on the following packages:
* express
* bcrypt
* cors
* db-migrate
* db-migrate-pg
* dotenv
* jsonwebtoken
* pg
* typescript
For development, there are additional dependencies
* jasmine
* jasmine-spec-reporter
* jasmine-ts
* prettier
* eslint-config-prettier
* eslint-plugin-prettier
* nodemon
* supertest
* ts-node
* tsc-watch

See the file `package.json` for the exact versions used.

## Testing
A total of 78 tests can be run with
`yarn run test`

## Postgres database migrations
To run the migration up in the dev environment, run
```
db-migrate up
``` 
To run the migration up in the test environment, run
```
db-migrate up -e test
```
To run the migrations down, substitute `down`for `up`.

Note: all the migrations are in one file, so that tables are created and deleted in an order that is compatible with the use of foreign keys.

## Setting up environment variables
The following environment variables need to be set up:
- POSTGRES_HOST=127.0.0.1
- POSTGRES_DB=storefront_backend
- POSTGRES_DB_TEST=storefront_backend_test
- POSTGRES_USER=storefront_user
- POSTGRES_PASSWORD=7kJ3DDpqnHe3Qx
- ENV=dev
- BCRYPT_SALT_ROUNDS=10
- TOKEN_SECRET=LV7erLeKYDY47p (This value can be changed)
- BCRYPT_PEPPER=ifSgBKoG5HShSW (This value can be changed)

## Starting the server
In order to start the server that exposes the API, type
`yarn run start`

# Folder structure

The main folders are:
* `src` contains all the source files (in Typescript)
  * `src/handlers` contains the API endpoints (see file `REQUIREMENTS.md` for details)
  * `src/handlers/tests` contains the tests for the API endpoints
  * `src/models` contains functions for accessing the Postgres database (see file `REQUIREMENTS.md` for details)
  * `src/models/tests` contains the tests for the functions for accessing the Postgres databasefor
  * `src/services` contains the function that extracts from the Postgres database the 5 products that appear in most orders (see file `REQUIREMENTS.md` for details)
  * `src/services/tests` contains the test for the function that extracts the 5 products that appear in most orderss for the API endpoints
  * `src/database.ts` configures the acces to the Postgres database in javascript based on environment variables
  * `src/server.ts` containt the code that starts the express server and configures its routes
* `migrations` contains the migration to create/delete table in the database, whether in test or dev
* `build` contains the javascript files transpiled from TypeScript
* `spec`contains a support file for tests



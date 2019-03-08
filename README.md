# FLYACTS backend

**Please note**: This project is still work in progress and not yet production ready.

## what

Welcome to the introduction page of our backend technology.

Our stack consists of these parts:

* [Node](https://nodejs.org/en/)
* [TypeScript](https://www.typescriptlang.org/)
* [Express](https://expressjs.com/) with [Routing Controllers](https://github.com/typestack/routing-controllers/)
* [TypeORM](http://typeorm.io) with [PostgreSQL](https://www.postgresql.org/)

The backend is contained in these packages:

* `@flyacts/create-backend`: An npm-init-script for bootstraping a new backend.
* `@flyacts/backend-user-management`: Entities, helpers and migrations for user management.
* `@flyacts/backend-media-management`: Entities, helpers and migrations for media management.

## getting started

You can start a new project with npm:

``` shell
$ npm init @flyacts/backend
```

It will ask some questions and then you'll have a ready made backend.

Controllers go into `src/controlers` and entities to `src/entities`. When you
add a new controller make sure you register it in `src/server.ts`.

To start your backend run `npm run start:dev`.

**Note**: You need a postgresql database running. For your development
convinience you can start one via docker: `npm run democontent`.

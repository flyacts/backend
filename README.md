# FLYACTS backend

**Please note**: This project is still work in progress and not yet production ready.

## what

Welcome to the introduction page of our backend technology.

Our stack consists of these parts

* [Node](https://nodejs.org/en/)
* [TypeScript](https://www.typescriptlang.org/)
* [Express](https://expressjs.com/) with [Routing Controllers](https://github.com/typestack/routing-controllers/)
* [TypeORM](http://typeorm.io) with [PostgreSQL](https://www.postgresql.org/) or [SQLite](https://www.sqlite.org/)


The backend is contained in these packages:

* [`@flyacts/backend-core-entities`](https://github.com/flyacts/backend-core-entities)
* [`@flyacts/backend-crud-services`](https://github.com/flyacts/backend-crud-services)

A backend using our stack can be found here:

https://github.com/flyacts/speakers-list-backend



## why

We previously used [loopback
3](https://github.com/strongloop/loopback) to produce a REST-Interface
and we were not very happy with it. The ORM was very primitive, ACLs
where pretty hard to understand and even though the automatic
generation of endpoints was one of the criteria why we choose loopback
in the end it was a hindrance because there where just too many
endpoints.

As the next we coined some key criteria:

* Everything should be TypeScript
* ORM and HTTP Handling should be seperated projects, to replace one
  or another.
* ORM should have migrations included (Loopback ORM has no
  migrations!)
* [The Zen of Python](https://www.python.org/dev/peps/pep-0020/)

As for the ORM Layer there is only one contender and that is TypeORM
and that is fine, because it is very complete and proven enough.

At the HTTP-Layer there where three suitors:

* [Loopback 4](http://v4.loopback.io/)
* [nest](https://nestjs.com/)
* [Routing
  Controllers](https://github.com/typestack/routing-controllers/)

We decided against loopback and nest because they were too complicated
and too abstract. Routing controllers hits a sweet spot in giving you
a very nice way to speak to express via typescripts
annotations.

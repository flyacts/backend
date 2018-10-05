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

At FLYACTS we are building mostly mobile applications and some of
these apps need a backend to provide a datastore or perform
computations. As these backends are tightly coupled to the
applications we choose to implement REST-Backends. As the number of
backends we build each year is greater than 1, we need a flexible
infrastructure and building blocks that we can tie into our code.

We previously used [loopback
3](https://github.com/strongloop/loopback) to build a REST-Interface
and we were not very happy with it. The ORM was very primitive, ACLs
where pretty hard to debug and even though the automatic
generation of endpoints was one of the criteria why we choose loopback
in the end it was a hindrance because there where just too many
endpoints, which confused the frontend developers.

As the next step we coined some key criteria:

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

Everyone of these frameworks uses express under the hood and we
think that the wrapping arround express should be thin and in a
typescript centric way. We looked at loopback and nest and found a
very complex framework that certainly makes sense, if you are building
a large scale of applications, but most of our backends don't reach
that level and the key is to getting things done in a timely
fashion. In the end we discovered routing controllers which provides
an extensive typescript wrapper arround express and is exactly what we
need.

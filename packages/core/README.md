# FLYACTS backend

**Please note**: This project is still work in progress and not yet production ready.

## what

Welcome to the introduction page of our backend technology.

Our stack consists of these parts:

* [Node](https://nodejs.org/en/)
* [TypeScript](https://www.typescriptlang.org/)
* [Express](https://expressjs.com/) with [Routing Controllers](https://github.com/typestack/routing-controllers/)
* [TypeORM](http://typeorm.io) with [PostgreSQL](https://www.postgresql.org/) or [SQLite](https://www.sqlite.org/)


The backend is contained in these packages:

* [`@flyacts/backend-core-entities`](https://github.com/flyacts/backend-core-entities)
* [`@flyacts/backend-crud-services`](https://github.com/flyacts/backend-crud-services)

A demo backend using our stack can be found here:

https://github.com/flyacts/speakers-list-backend



## why

At FLYACTS we are building mostly mobile applications. Some of
these apps need a backend to provide a datastore or perform
computation. As these backends are tightly coupled to the
applications, we choose to implement them as REST-APIs. Since we implement multiple custom solutions each year, we need a flexible
infrastructure and building blocks.

We previously used [loopback
3](https://github.com/strongloop/loopback) to build REST-Interfaces,
but we were not very happy with it. The ORM is very primitive and ACLs
are hard to debug. Even though the automatic
generation of endpoints was one of our main reasons to use loopback in the first place, the sheer amount of unused ones outweigh the benefits for us.

As the next step we defined some key criteria:

* Everything should be TypeScript
* ORM and HTTP handling should be seperate projects, which can be replaced individually
* ORM should have migrations included (Loopback ORM does not!)
* [The Zen of Python](https://www.python.org/dev/peps/pep-0020/)

As for the ORM layer, there is only one contender, TypeORM.
That is fine, since the project is pretty solid.

At the HTTP-Layer, there where three contestants:

* [Loopback 4](http://v4.loopback.io/)
* [nest](https://nestjs.com/)
* [Routing
  Controllers](https://github.com/typestack/routing-controllers/)

Express is used in all of them, but we thought the wrapping should be lightweight and written in TypeScript.
Loopback and nest are very complex frameworks, offering a lot of functionality. That's great if you try to build large scale applications. Most our use cases aren't that complex and we need to get things done in a timely fashion. We decided to go with routing-controlers, since although it provides an extensive typescript wrapper, it does not overcomplicate things.

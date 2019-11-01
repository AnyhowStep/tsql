### Photon.js

Quoting parts of their `README`,

> [Photon.js](https://photonjs.prisma.io/) is an **auto-generated database client** that enables **type-safe** database access and **reduces boilerplate**.
>
> It is part of the [Prisma 2](https://www.github.com/prisma/prisma2) ecosystem. Prisma 2 provides database tools for data access, declarative data modeling, schema migrations and visual data management.

-----

### Links

+ Repository: https://github.com/prisma/photonjs
+ Specification: https://github.com/prisma/specs/tree/master/photonjs
+ Prisma Framework Information: https://github.com/prisma/prisma2
+ Data Model Definition: https://github.com/prisma/prisma2/blob/master/docs/data-modeling.md#data-model-definition
+ Lift (Database Schema Migration Tool): https://github.com/prisma/lift

-----

### Feature Overview

| Feature | Photon.js | `tsql` |
|---------|-----------|--------|
Automated schema declarations | Using data model definitions/schema introspection, and Lift | Not yet; should be done with the help of `information_schema` introspection
Connection pooling | Yes | Yes
Nested object `INSERT` in one call | Yes | No
MySQL support | Yes | Not yet; should create a separate `@tsql/mysql-5.7` library
PostgreSQL support | Yes | Not yet; should create a separate `@tsql/pg-9.4` library
SQLite support | Yes | Not yet; should create a separate `@tsql/sqlite-js-3.28` library (the tests in this library use SQLite)
MongoDB support | *(Coming very soon)* | Not yet; maybe?
Cursor support | Yes (How?) | Yes; emulated cursor because MySQL does not natively support cursors
Raw queries | Yes | Partial; not ergonomic yet
Query builder | (Need to check) | Yes


TODO More feature comparisons

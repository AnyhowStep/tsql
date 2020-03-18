[![Build Status](https://travis-ci.org/AnyhowStep/tsql.svg?branch=master)](https://travis-ci.org/AnyhowStep/tsql) [![codecov](https://codecov.io/gh/AnyhowStep/tsql/branch/master/graph/badge.svg)](https://codecov.io/gh/AnyhowStep/tsql) [![npm version](https://badge.fury.io/js/%40squill%2Fsquill.svg)](https://badge.fury.io/js/%40squill%2Fsquill) [![HitCount](http://hits.dwyl.io/AnyhowStep/tsql.svg)](http://hits.dwyl.io/AnyhowStep/tsql) [![Known Vulnerabilities](https://snyk.io/test/github/AnyhowStep/tsql/badge.svg?targetFile=package.json)](https://snyk.io/test/github/AnyhowStep/tsql?targetFile=package.json) ![dependencies](https://david-dm.org/AnyhowStep/tsql.svg)

This library currently has the following adapter libraries,
+ [mysql-5.7](https://github.com/anyhowstep/tsql-mysql-5.7)
+ [sqlite3 (for browser)](https://github.com/anyhowstep/tsql-sqlite3-browser)

You may test this library (and execute SQLite3 queries!) with this playground link,
https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public

### Documentation

[Work-in-progress Documentation may be found here](squill-doc/README.md)

[Deprecated Documentation may be found here](doc-deprecated.md)

-----

### Goals

+ As much as possible, compile-time type-safety!
  + Run-time checks should also be included, as much as possible (without impacting performance too much)
  + Expressions, sub-queries, correlated sub-queries, etc. must be composable and should have compile-time checks

+ Provide unified query-building
  + Write query-building code **once**
  + Execute on server (MySQL/PostgreSQL) and browser client (using [`sql.js`](https://github.com/kripken/sql.js/))

+ Provide query-building specific to a database **and version**
  + Unified query-building will have to sacrifice features not supported by some database systems
  + Tailoring code to just one database and version means no need to sacrifice features (in general)

### Non-Goals

+ Efficiency
  + You won't catch me writing O(2<sup>n</sup>) algorithms but I won't lose sleep over wasted CPU cycles

+ Direct support for MySQL `BIGINT UNSIGNED` type.
  + PostgreSQL and SQLite do not support `BIGINT UNSIGNED`.
  + Trying to shoehorn support for it has proven too complex.
  + This may be supported by the MySQL-specific version.

-----

### Project Structure

This project will have multiple subprojects,

+ Database-unifying subproject
  + Provides all the composable components one needs to create a compile-time safe SQL query-building library
  + Unifies query-building for,
    + MySQL
      + 5.7.26
      + It's the version I use for work and personal projects at the moment
    + SQLite
      + https://github.com/kripken/sql.js/
      + 3.28
      + One of the goals is to write a query once and execute it both on a server and browser client environment
    + PostgreSQL
      + Specific version undecided
      + Must not be a version that has been released too recently
      + An eye is kept on PostgreSQL to sanity-check the other two implementations
      + According to @webstrand ,
        > 9.4 still receives updates, ubuntu 16.04 expires in 2021 and only has 9.5.
        > So at least 9.5.

        Preference is leaning towards 9.4 at the moment.
  + **DOES NOT** produce SQL strings; only builds an abstract syntax tree
  + **DOES NOT** execute SQL strings
  + Major version bumps may change which databases and versions are unified
    + A future version of this library may choose to unify MySQL 8.x, PostgreSQL 11.x

  Because it must support multiple databases, it will only support features that all three databases support.
  This means that many features will be excluded.

+ Subprojects specific to a database **and version**
  + Uses composable components to implement features specific to a database **and version**
    + This means we do not need to sacrifice features for the sake of compatibility
  + Implements abstract syntax tree to SQL string converter
  + Implements SQL execution

-----

### Running on Non-`node` Environments

This library requires `BigInt` support.

If your environment does not have them, you must polyfill them before this library is loaded.

-----

The simplest `BigInt` polyfill that should work is,
```ts
(global as any).BigInt = ((value : string|number|bigint) => {
  return {
    toString : () => {
      return String(value);
    },
  };
}) as any;
```

-----

### Notes

+ `typed-orm` supported `RIGHT JOIN`s. Support is removed in this rewrite.
  + All `RIGHT JOIN`s can be rewritten as `LEFT JOIN`s
  + Using `RIGHT JOIN` on a `LATERAL` derived table introduces problems,
    https://dev.mysql.com/doc/refman/8.0/en/lateral-derived-tables.html
    > If the table is in the left operand and contains a reference to the right operand, the join operation must be an INNER JOIN, CROSS JOIN, or RIGHT [OUTER] JOIN.

    It is possible to use a column before it even exists in the query.
    This complicates compile-time type checking code.
  + Maybe keep support for `RIGHT JOIN` but not support `RIGHT JOIN LATERAL`?

-----

### TODO

+ Important, create sub-packages for different MySQL versions/different DBMSs
+ Support for other DBMS'
  > random 2cents: if you're going for this, I say ideally support every sql offered by aws rds (aurora, postgres, my, maira, oracle & MS)
+ Refactor `FromXxx` to `FromXxxArray` if it is meant to distribute?
+ Monitor this issue,
  https://github.com/microsoft/TypeScript/issues/32824
  + Remove all "unnecessary" parentheses from top-level type aliases
+ Read https://stackoverflow.com/questions/41312641/is-it-possible-to-have-a-datetime-mapper-for-every-underlaying-rdbms
+ Reduce `lib` and `target` until we reach `es2015`?
  + What would be a good value for these things?
  + Browser-compatibility?
+ List of OIDs for built-in data types,
  + https://github.com/brianc/node-pg-types/blob/master/index.d.ts#L1
  + https://github.com/brianc/node-pg-types/blob/master/lib/builtins.js
+ https://github.com/gajus/eslint-plugin-sql

  To be used with https://github.com/brianc/node-postgres

+ https://okbob.blogspot.com/2009/08/mysql-functions-for-postgresql.html

+ Consider forcing users of library to allow library to create a library-specific schema for stored procedures/functions
  to unify behaviour of built-in functions/operators.

  + Personal opinion is that this should only be a last resort.
  + Should try to unify behaviour without it.

+ More goals and non-goals

+ Examples of compile-time type-safety you won't get from other libraries

+ Remove usages of "I" and replace with "we"?

+ WTF, Postgres!?
  + https://stackoverflow.com/questions/43111996/why-postgresql-does-not-like-uppercase-table-names
  + https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS

> Quoting an identifier also makes it case-sensitive, whereas unquoted names are always folded to lower case. For example, the identifiers FOO, foo, and "foo" are considered the same by PostgreSQL, but "Foo" and "FOO" are different from these three and each other. (The folding of unquoted names to lower case in PostgreSQL is incompatible with the SQL standard, which says that unquoted names should be folded to upper case. Thus, foo should be equivalent to "FOO" not "foo" according to the standard. If you want to write portable applications you are advised to always quote a particular name or never quote it.)

+ https://stackoverflow.com/questions/41936403/mysql-ieee-floating-point-nan-positiveinfinity-negativeinfinity
  + `NaN`, `+Infinity`, `-Infinity` are not valid `DOUBLE` values according to the SQL standard

+ Investigate and compare against,
  + https://github.com/prisma/photonjs
  + https://github.com/jawj/mostly-ormless/blob/master/README.md
  + https://news.ycombinator.com/item?id=21031187
  + https://github.com/vincit/objection.js
  + https://github.com/typeorm/typeorm
  + https://github.com/sequelize/sequelize
  + https://github.com/hediet/ts-typed-sql
  + https://github.com/mikro-orm/mikro-orm

+ This library will not handle migrations but it's good to keep an eye on promising migration libraries
  + https://github.com/graphile/migrate
  + https://sqitch.org/

+ Remove static use of potentially polyfilled functions like `BigInt`, etc.
  + Stick to lazy initialization

+ Investigate https://www.postgresql.org/docs/9.2/sql-syntax-lexical.html#SQL-SYNTAX-STRINGS-ESCAPE
  + The escaping rules seem to have changed a lot over the different versions
  + An escape string constant is specified by writing the letter `E` (upper or lower case) just before the opening single quote, e.g., `E'foo'`.
  + If the configuration parameter `standard_conforming_strings` is `off`, then PostgreSQL recognizes backslash escapes in both regular and escape string constants. However, as of PostgreSQL 9.1, the default is `on`

+ Add subqueries to certain callbacks (For example, the `.where()` method)
  + The `.select()` and `.selectValue()` methods already have this

<!--
> I'm just thinking about how...
yeah the nicity of being able to call like find, and have the code manage going like
"they've given a primary key, so I can build the query like this to leveage that" and what not
but obviously you need a strict library like this one powering the convinence methods, so like you've def got something
but thats why I could see people skimming over it - b/c people generally always favor simplicy & easy over secure, fast, etc
and yeah to me eslint is a logical place to explore if theres a way to leverage that w/ what your library does. There might not be, but like imo thats the sort of presentation you want
as an example: doing raw mysql stuff in languages like PHP is always fun in IntelliJ, b/c it knows your DB and will do just that - it'll tell you when you're using a column that doesn't exist, or written a query that's really suboptimal
which is also one of those cool things I'm super sad we pretty much never get to use, b/c typically we use like PDO or like...
LINQ or whatever, that means it's methods & stuff that theres little point making your IDE/tooling have special support & features for, since it's so easy to make such libraries that every man and his dog will be complaining their library doesn't trigger "you could do this better" inspections and so on.
so there you go; thats my 2 cents rant on a super awesome hidden gem feature in IntelliJ that pretty much never gets to be used, that no one asked for :D
your library looks cool man - keep me in the loop :D
btw have you ever checked out loki?
http://lokijs.org/

-->

-----

### TODO Feature Parity with `typed-orm`

+ Emulated `FULL OUTER JOIN` (MySQL does not have it)

-----

### More TODO

+ Application schema generation from DB schema?
  + Requires data type from `information_schema`

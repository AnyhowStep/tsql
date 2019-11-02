[![Build Status](https://travis-ci.org/AnyhowStep/tsql.svg?branch=master)](https://travis-ci.org/AnyhowStep/tsql)

[![codecov](https://codecov.io/gh/AnyhowStep/tsql/branch/master/graph/badge.svg)](https://codecov.io/gh/AnyhowStep/tsql)

This library is unusable at the moment.
It is a work-in-progress and a rewrite of [`typed-orm`](https://github.com/anyhowstep/typed-orm)

-----

### Documentation

0. [Defining Tables](doc/00-getting-started/00-defining-tables.md)
0. [Data Types](doc/00-getting-started/01-data-types.md)

   0. [Null-Safe Equality](doc/00-getting-started/02a-correlated-subqueries.md)

0. [`FROM` clause](doc/00-getting-started/01a-null-safe-equality.md)

   0. [Correlated Subqueries](doc/00-getting-started/02a-correlated-subqueries.md)

0. [`WHERE` clause](doc/00-getting-started/03-where-clause.md)

0. [`SELECT` clause](doc/00-getting-started/04-select-clause.md)

0. [`ORDER BY` clause](doc/00-getting-started/05-order-by-clause.md)

0. [`LIMIT` clause](doc/00-getting-started/06-limit-clause.md)

0. [Compound Query (`UNION`/`INTERSECT`/`EXCEPT`)](doc/00-getting-started/07-compound-query.md)

0. [Compound Query `ORDER BY` clause](doc/00-getting-started/08-compound-query-order-by-clause.md)

0. [Compound Query `LIMIT` clause](doc/00-getting-started/09-compound-query-limit-clause.md)

0. [`.map()`](doc/00-getting-started/10-map.md)

0. [`.fetchAllXxx()`](doc/00-getting-started/11-fetch-all-xxx.md)

0. [`.fetchOneXxx()`](doc/00-getting-started/12-fetch-one-xxx.md)

   0. [`table.fetchOneXxx()`](doc/00-getting-started/12a-table-fetch-one-xxx.md)

0. [`.fetchValueArray()`](doc/00-getting-started/13-fetch-value-array.md)

0. [`.fetchValueXxx()`](doc/00-getting-started/14-fetch-value-xxx.md)

   0. [`table.fetchValueXxx()`](doc/00-getting-started/14a-table-fetch-value-xxx.md)

0. [`.paginate()`](doc/00-getting-started/15-paginate.md)

0. [`.emulatedCursor()`](doc/00-getting-started/16-emulated-cursor.md)

0. [`query.count()`](doc/00-getting-started/17-query-count.md)

0. [`query.exists()/query.assertExists()`](doc/00-getting-started/18-query-exists.md)

   0. [`table.exists()/table.assertExists()`](doc/00-getting-started/18a-table-exists.md)

0. [Derived Table](doc/00-getting-started/19-derived-table.md)

0. [`INSERT`](doc/00-getting-started/20-insert.md)

0. [`DELETE`](doc/00-getting-started/21-delete.md)

0. [`UPDATE`](doc/00-getting-started/22-update.md)

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

This library requires `BigInt` and `Buffer` support.

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

The simplest `Buffer` polyfill that should work is,
```ts
(global as any).Buffer = {
  isBuffer : (mixed : unknown) : mixed is Buffer => {
    return /*snip implementation*/;
  },
} as any;
```

If the above returns `true`, then the `Buffer` must support,
```ts
interface Buffer {
    equals : (other : Buffer) => boolean,
    toString : (encoding : "hex") => string,
}
```

See the internal `Buffer` declaration [here](src/buffer.ts)


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
+ Add `fetchOneByPrimaryKey` alias for `fetchOneByPk` and other similar methods
+ Support for other DBMS'
  > random 2cents: if you're going for this, I say ideally support every sql offered by aws rds (aurora, postgres, my, maira, oracle & MS)
+ Avoid single-letter names in documentation/readme; prefer `columns` over `c`
+ `fetchOneByArbitraryCondition`
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

+ Investigate cursors
  + https://github.com/sidorares/node-mysql2/issues/1014
  + https://github.com/sidorares/node-mysql2/pull/822#issuecomment-409415308
  + https://github.com/sidorares/node-mysql2/blob/9404163b0dc4bdc24f6dddd18144532f41115842/lib/commands/query.js#L239
  + https://github.com/mysqljs/mysql/issues/274

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

+ Remove static use of potentially polyfilled functions like `BigInt`, `Buffer`, etc.
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

Investigate Bug with SQLite,
```sql
CREATE TABLE "myTable" (
	"myColumn" INT PRIMARY KEY
);
INSERT INTO
	"myTable"("myColumn")
VALUES
	(4);

SELECT (
  3e0 IN(
    COALESCE(
      (
        SELECT
          "myTable"."myColumn" AS "myTable--myColumn"
        FROM
          "myTable"
        LIMIT
          0
        OFFSET
          0
      ),
      3e0
    )
  )
);
```

+ Expected result : `true`
+ PostgreSQL : `true`
  + https://www.db-fiddle.com/f/aaKrWx7aAuzzC2HWPcrsBn/8
+ MySQL : `true`
  + https://www.db-fiddle.com/f/tJNBFe4ECTJcHzgAjKvTz4/1
+ SQLite : `false`
  + https://www.db-fiddle.com/f/vvtNQMEZ4FGfpvmRp3Linv/1

-----

Investigate Bug with SQLite,
```sql
CREATE TABLE "myTable" (
  "myColumn" INT PRIMARY KEY
);
INSERT INTO
  "myTable"("myColumn")
VALUES
  (4);

SELECT
  COALESCE(
    (
      SELECT
        "myTable"."myColumn" AS "myTable--myColumn"
      FROM
        "myTable"
      LIMIT
        0
      OFFSET
        0
    ),
    3e0
  );
```

+ Expected result : `3`
+ PostgreSQL : `3`
+ MySQL : `3`
+ SQLite : `4`
  + `COALESCE()` seems to ignore the `LIMIT 0` clause.
  + Use `WHERE FALSE` when building SQL string.

```sql
CREATE TABLE "myTable" (
  "myColumn" INT PRIMARY KEY
);
INSERT INTO
  "myTable"("myColumn")
VALUES
  (4);

SELECT
  COALESCE(
    (
      SELECT
        "myTable"."myColumn" AS "myTable--myColumn"
      FROM
        "myTable"
      WHERE
        FALSE
      LIMIT
        0
      OFFSET
        0
    ),
    3e0
  );
```

-----

Be careful of integer literals in the `ORDER BY` clause.

This is invalid (MySQL, PostgreSQL, SQLite),
```sql
SELECT
  1
ORDER BY
  32 ASC;
```

This is valid (MySQL, PostgreSQL, SQLite),
```sql
SELECT
  1
ORDER BY
  32+0 ASC;
```

This is invalid (PostgreSQL; valid for other two databases),
```sql
SELECT
  1
ORDER BY
  32e0 ASC;
```

This is valid (MySQL, PostgreSQL, SQLite),
```sql
SELECT
  1
ORDER BY
  32e0+0 ASC;
```

-----

### TODO Feature Parity with `typed-orm`

+ Table-Per-Type Utils
+ Audit Log Pattern Utils
+ Application<->DB schema validation
+ Emulated `FULL OUTER JOIN` (MySQL does not have it)
+ Make `type-mapping` fit the `tsql` use case better.
  + Prefer `tm.db.bigIntSigned()` over `tm.mysql.bigIntSigned()` or something
+ Database events
+ Unify `information_schema` access?

At the moment, written with MySQL 5.7.26 in mind.

This library is unusable at the moment.
It is a work-in-progress and a rewrite of [`typed-orm`](https://github.com/anyhowstep/typed-orm)

-----

### Documentation

0. [Defining Tables](doc/00-getting-started/00-defining-tables.md)

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

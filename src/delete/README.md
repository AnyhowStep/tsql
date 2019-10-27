### Goals

+ Single-table delete statements


### Non-Goals

+ Multi-table delete statements
  + MySQL supports it
  + PostgreSQL does not
  + SQLite does not
+ `USING` clause
  + MySQL supports it
  + PostgreSQL supports it
  + SQLite does not
  + You should just use subqueries like in standard SQL.
+ `ORDER BY`
  + MySQL supports it
  + PostgreSQL does not
  + SQLite supports it
+ `LIMIT`
  + MySQL supports it
  + PostgreSQL does not
  + SQLite supports it
+ Protecting users from `ER_UPDATE_TABLE_USED` during compile-time
  + See elaboration below

The DB-specific libraries may support these non-goals of the DB-agnostic library.

-----

### `ER_UPDATE_TABLE_USED`

This is a problem with MySQL.
The following is considered invalid in MySQL,
```sql
DELETE FROM test
WHERE
    testId IN (
        SELECT
            b.testId
        FROM
            test AS b
        WHERE b.testVal > 7
    );
```

SQLite and PostgreSQL have no problem with it.
It should be standard SQL.

Solutions,
+ Convert subqueries to use temporary table
+ Rewrite statement to use joins (the non-standard `USING` clause) instead of subqueries

-----

### SQLite

https://www.sqlite.org/lang_delete.html

High level syntax,
```sql
DELETE FROM
    :table
WHERE
    :expr
```

-----

### Compile-time safety and `ER_UPDATE_TABLE_USED`

For now, this library **CANNOT** protect you from `ER_UPDATE_TABLE_USED` errors during compile-time.

To add support for this, we would need to keep track of what tables
are used in subqueries, for every expression.

So, if an expression `A` is made of of subexpressions nested 50 layers deep,
and the 50th layer has a subquery using table `T`, then we need to propagate
that information up to the top-level expression `A` during compile-time.

Then, when attempting to pass expression `A` to the `WHERE` clause of an `UPDATE/DELETE` statement,
we need to check what tables are used in subqueries of `A`, no matter how many layers deep.

If `T` is the target of `UPDATE/DELETE`, and `T` is a used subquery table name,
we give a compile-time error.

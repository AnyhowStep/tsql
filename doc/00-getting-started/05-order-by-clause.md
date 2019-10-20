### `ORDER BY` Clause

The `ORDER BY` clause lets you specify the order of rows in the result set.

-----

### `SortExpr`

In SQL, you can only `ORDER BY` a column, an alias in the `SELECT` clause, or **unaliased** expression,
```sql
SELECT
    (myTable.myColumn + 32) AS x
FROM
    myTable
ORDER BY
    -- Column
    myTable.myColumn ASC,
    -- Alias in `SELECT` clause
    x ASC,
    -- Unaliased expression
    (myTable.myColumn + myTable.myOtherColumn) ASC,
    -- Unaliased subquery expression
    (
        SELECT
            otherTable.otherColumn
        FROM
            otherTable
        WHERE
            myTable.myTableId = otherTable.myTableId
        LIMIT
            1
    ) ASC
```

-----

In general, this library permits **aliased** expressions to be used as **unaliased** expressions.
When this occurs, the library simply converts to an unaliased expression by stripping the alias.

Therefore, you may use an **aliased** expression as a `SortExpr` with this library.

-----

### `SortDirection`

There are two kinds of `SortDirection`,
+ `ASC`
+ `DESC`

If no `SortDirection` is specified, `ASC` is implied.

However, it is recommended that you always explicitly specify a sort direction, for clarity.

-----

### Implied `SortDirection` and Unaliased Subqueries

At the moment, you **must always** specify a sort direction when using an **unaliased subquery** as a sort expression.

This is required because we cannot easily check the `IUsedRef` of an `IQueryBase` object, at the moment.
Because of this oversight, you can perform the following sorts,
+ `myQuery.asc()`
+ `myQuery.desc()`
+ `myQuery.sort(sortDirection)`
+ `myQuery.coalesce(defaultValue)`
+ `myQuery.coalesce(defaultValue).asc()`
+ `myQuery.coalesce(defaultValue).desc()`
+ `myQuery.coalesce(defaultValue).sort(sortDirection)`
+ `myQuery.as(alias)`
+ `myQuery.as(alias).asc()`
+ `myQuery.as(alias).desc()`
+ `myQuery.as(alias).sort(sortDirection)`

However, you cannot perform the following sort,
+ `myQuery` (with `ASC` implied)

See the tests [here](test/compile-time/input/unified-query/order-by/subquery-as-sort-expr) and [here](test/compile-time/input/unified-query/order-by/subquery-as-sort-expr-implicit-asc-not-allowed) for examples.

-----

### `.orderBy()`

An arbitrary `ORDER BY` clause may be specified with,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable`, `otherTable` elsewhere
 */
import {myTable, otherTable} from "./table";

const myQuery = tsql
    .from(myTable)
    .select(columns => [
        tsql.integer.add(
            columns.myColumn,
            32n
        ).as("x")
    ])
    .orderBy((columns, subquery) => [
        //Column
        columns.myTable.myColumn.asc(),
        //Alias in `SELECT` clause
        columns.__aliased.x.asc(),
        //Unaliased expression
        tsql.integer.add(
            columns.myTable.myColumn,
            columns.myTable.myOtherColumn
        ).asc(),
        //Unaliased subquery expression
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                /**
                 * We now have multiple tables in the `FROM` clause (and outer query `FROM` clause).
                 * So, we must now qualify columns with a table name.
                 */
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
            .asc(),
    ]);
```

The above is the same as writing,
```sql
SELECT
    (myTable.myColumn + 32) AS x
FROM
    myTable
ORDER BY
    -- Column
    myTable.myColumn ASC,
    -- Alias in `SELECT` clause
    x ASC,
    -- Unaliased expression
    (myTable.myColumn + myTable.myOtherColumn) ASC,
    -- Unaliased subquery expression
    (
        SELECT
            otherTable.otherColumn
        FROM
            otherTable
        WHERE
            myTable.myTableId = otherTable.myTableId
        LIMIT
            1
    ) ASC
```

### Compound Query `ORDER BY` Clause

The compound query `ORDER BY` clause lets you specify the order of rows of a compound query.

-----

### `SortExpr` for Compound Query `ORDER BY` Clause

Only aliases in the `SELECT` clause of the first query are allowed as sort expressions.

MySQL allows columns and unaliased expressions as sort expressions, but PostgreSQL and SQLite do not.

References:
+ https://www.postgresql.org/docs/9.5/queries-order.html
  > ORDER BY can be applied to the result of a UNION, INTERSECT, or EXCEPT combination, but in this case it is only permitted to sort by output column names or numbers, not by expressions.
+ https://www.sqlite.org/lang_select.html#orderby

-----

### `.compoundQueryOrderBy()`

An arbitrary `ORDER BY` clause for compound queries may be specified with,
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
    .unionAll(
        tsql
            .from(otherTable)
            .select(columns => [
                columns.otherColumn
            ])
    )
    .compoundQueryOrderBy((columns) => [
        //Alias in `SELECT` clause of first query
        columns.x.asc(),
    ]);
```

The above is the same as writing,
```sql
SELECT
    (myTable.myColumn + 32) AS x
FROM
    myTable
UNION ALL
SELECT
    otherTable.otherColumn
FROM
    otherTable
ORDER BY
    x ASC
```

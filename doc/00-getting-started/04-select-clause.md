### `SELECT` Clause

The `SELECT` clause lets you specify what columns the result set should have.

-----

### `SelectItem`

In SQL, you can only `SELECT` a column, or aliased expression,
```sql
SELECT
    -- Column
    myTable.myColumn,
    -- Aliased Column Expression
    myTable.myColumn2 AS aliasedColumnExpression,
    -- Aliased Literal Value Expression
    'I am an aliased expression' AS aliasedLiteralValueExpression,
    -- Aliased Expression
    'I am another aliased expression' || myTable.stringColumn AS aliasedExpression,
    -- Aliased Subquery Expression
    (
        SELECT
            otherTable.otherColumn
        FROM
            otherTable
        WHERE
            myTable.myTableId = otherTable.myTableId
        LIMIT
            1
    ) AS aliasedSubqueryExpression
FROM
    myTable
```

You can use `*`, `myTable.*` in the `SELECT` clause but they are just syntactic sugar for selecting columns.

You can use expressions without aliasing them in the `SELECT` clause but that's just leaving the alias implied.

-----

The following is a table that shows the mapping between the types of `SelectItem` in SQL and this library,

SQL                                 | `tsql`
------------------------------------|-----------------------------------------
Column                              | `IColumn`
Aliased Column Expression           | `AliasedExpr implements IExprSelectItem` (`myColumn.as("aliasedColumnExpression")`)
Aliased Literal Value Expression    | `AliasedExpr implements IExprSelectItem` (`ExprUtil.fromRawExpr(value).as("aliasedLiteralValueExpression")`)
Aliased Expression                  | `AliasedExpr implements IExprSelectItem` (`myExpr.as("aliasedExpression")`)
Aliased Subquery Expression         | `DerivedTableSelectItem implements IExprSelectItem` (`mySubquery.as("aliasedSubqueryExpression")`)
`*`                                 | `ColumnRef` (if `FROM` clause has more than one table), `ColumnMap` (if `FROM` clause has one table)
`myTable.*`                         | `ColumnMap`

-----

### `SELECT` Overview

The most basic method to build the `SELECT` clause,
+ `.select(selectDelegate)`

These methods build upon `.select()` to simplify common `SELECT` clause patterns,
+ `.selectValue(selectValueDelegate)`

These methods modify the behaviour of the `SELECT` clause,
+ `.distinct()`

-----

### `.select()`

An arbitrary `SELECT` clause may be specified with,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable`, `otherTable` elsewhere
 */
import {myTable, otherTable} from "./table";

const myQuery = tsql
    .from(myTable)
    .select((columns, subquery) => [
        /**
         * With only one table in the `FROM` clause,
         * we do not need to qualify columns with a table name.
         *
         * This refers to `myTable.myColumn`
         */
        columns.myColumn,
        columns.myColumn2.as("aliasedColumnExpression"),
        tsql.ExprUtil.fromRawExpr("I am an aliased expression").as("aliasedLiteralValueExpression"),
        tsql.concat(
            "I am another aliased expression",
            /**
             * With only one table in the `FROM` clause,
             * we do not need to qualify columns with a table name.
             *
             * This refers to `myTable.stringColumn`
             */
            columns.stringColumn
        ).as("aliasedExpression"),
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
            .as("aliasedSubqueryExpression")
    ]);
```

The above is the same as writing,
```sql
SELECT
    -- Column
    myTable.myColumn,
    -- Aliased Column Expression
    myTable.myColumn2 AS aliasedColumnExpression,
    -- Aliased Literal Value Expression
    'I am an aliased expression' AS aliasedLiteralValueExpression,
    -- Aliased Expression
    'I am another aliased expression' || myTable.stringColumn AS aliasedExpression,
    -- Aliased Subquery Expression
    (
        SELECT
            otherTable.otherColumn
        FROM
            otherTable
        WHERE
            myTable.myTableId = otherTable.myTableId
        LIMIT
            1
    ) AS aliasedSubqueryExpression
FROM
    myTable
```

-----

You may not use `.select()` after a `UNION/INTERSECT/EXCEPT` because `.select()` changes the number of columns in the result set.

-----

### `.selectValue()`

The `.selectValue()` method is a convenience method for selecting a single column/expression.
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable`, `otherTable` elsewhere
 */
import {myTable, otherTable} from "./table";

const myQuery = tsql
    .from(myTable)
    .selectValue((_columns, subquery) =>
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
    );
```

The above is the same as writing,
```sql
SELECT
    -- Subquery Expression
    (
        SELECT
            otherTable.otherColumn
        FROM
            otherTable
        WHERE
            myTable.myTableId = otherTable.myTableId
        LIMIT
            1
    )
FROM
    myTable
```

-----

You may not use `.selectValue()` after a `UNION/INTERSECT/EXCEPT` because `.selectValue()` changes the number of columns in the result set.

-----

### `.distinct()`

The `.distinct()` method converts a `SELECT ...` statement into a `SELECT DISTINCT ...` statement,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable` elsewhere
 */
import {myTable} from "./table";

const myQuery = tsql
    .from(myTable)
    .selectValue(columns => columns.myColumn)
    .distinct();
```

The above is the same as writing,
```sql
SELECT DISTINCT
    myTable.myColumn
FROM
    myTable
```

-----

### Interaction with Compound Queries (`UNION`/`INTERSECT`/`EXCEPT`)

The `.select()` and `.selectValue()` methods may not be used after a `UNION`/`INTERSECT`/`EXCEPT` because they change the number of columns in the result set.

-----

When writing a compound query,
the types of each `SelectItem` in the `SELECT` clause of each individual query must be "compatible".

Given queries `A` and `B`, assume we want to write, `A UNION B`.

At the moment, the "compatibility" criteria is,
+ `SELECT` clauses must have the same length
+ For each `SelectItem`,
  + If it is a `IColumn` or `IExprSelectItem`, then,
    + `B` must be a subtype of `A`
  + If it is a `ColumnMap`, then,
    + They must have exactly the same column aliases (no more, no less)
    + `B` must be a subtype of `A`
  + If it is a `ColumnRef`, then,
    + They must have exactly the same table aliases (no more, no less)
    + They must have exactly the same column aliases (no more, no less)
    + `B` must be a subtype of `A`

This may change in the future. For example, we could allow `A` to be a subtype of `B`.

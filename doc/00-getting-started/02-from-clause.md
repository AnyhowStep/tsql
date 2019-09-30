### `FROM` Clause

Most `SELECT` statements you build will begin with the `FROM` clause.

-----

The simplest way to start,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable` elsewhere
 */
import {myTable} from "./table";

const myQuery = tsql.from(myTable);
```

The above is the same as writing,
```sql
FROM
    myTable
```

At the moment, we don't have a `SELECT` statement we can execute yet.

-----

### `JOIN`s Overview

At the moment, this library supports the following `JOIN`s,
+ `.crossJoin(aliasedTable)`
+ `.innerJoin(aliasedTable, onDelegate)`
+ `.leftJoin(aliasedTable, onDelegate)`

-----

The following convenience methods build upon `.innerJoin()` and `.leftJoin()` to simplify some common `JOIN` operations,
+ `.innerJoinUsingPrimaryKey(srcDelegate, onDelegate)`
+ `.innerJoinUsingCandidateKey(srcDelegate, aliasedTable, eqCandidateKeyOfTableDelegate)`
+ `.leftJoinUsingPrimaryKey(srcDelegate, onDelegate)`
+ `.leftJoinUsingCandidateKey(srcDelegate, aliasedTable, eqCandidateKeyOfTableDelegate)`

-----

### `RIGHT JOIN`s

At the moment, `RIGHT JOIN`s are not supported because,
+ All `RIGHT JOIN`s can be rewritten as `LEFT JOIN`s

+ Using `RIGHT JOIN` on a `LATERAL` derived table introduces problems,
  https://dev.mysql.com/doc/refman/8.0/en/lateral-derived-tables.html
  > If the table is in the left operand and contains a reference to the right operand, the join operation must be an `INNER JOIN`, `CROSS JOIN`, or `RIGHT [OUTER] JOIN`.

  It is possible to use a column before it even exists in the query.

  This complicates compile-time type checking code.

-----

### `.crossJoin()`

To use a `CROSS JOIN`,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable`, `otherTable` elsewhere
 */
import {myTable, otherTable} from "./table";

const myQuery = tsql.from(myTable)
    .crossJoin(otherTable);
```

The above is the same as writing,
```sql
FROM
    myTable
CROSS JOIN
    otherTable
```

-----

### `.innerJoin()`

To use an `INNER JOIN`,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable`, `otherTable` elsewhere
 */
import {myTable, otherTable} from "./table";

const myQuery = tsql.from(myTable)
    .innerJoin(
        otherTable,
        /**
         * This lets us specify an arbitrary condition for the `ON` clause
         */
        columns => tsql.and(
            tsql.eq(columns.myTable.myTableId, columns.otherTable.myTableId),
            tsql.gtEq(columns.otherTable.otherColumn, 9001n)
        )
    );
```

The above is the same as writing,
```sql
FROM
    myTable
INNER JOIN
    otherTable
ON
    (myTable.myTableId = otherTable.myTableId) AND
    (otherTable.otherColumn >= 9001)
```

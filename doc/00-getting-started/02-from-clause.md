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

### `FULL OUTER JOIN`s

MySQL does not support `FULL OUTER JOIN`. So, this library does not support it, either.

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

### `.innerJoin()/.leftJoin()`

To use an `INNER JOIN`/`LEFT JOIN`,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable`, `otherTable` elsewhere
 */
import {myTable, otherTable} from "./table";

const myQuery = tsql.from(myTable)
    /**
     * You may substitute this for `.leftJoin()`
     */
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

-----

### `.innerJoinUsingPrimaryKey()/.leftJoinUsingPrimaryKey()`

Usually, when `JOIN`ing tables, we perform an equi-join using the primary key of a table,
```ts
import * as tsql from "@tsql/tsql";
import * as tm from "type-mapping/fluent";

const loanedBook = tsql.table("loanedBook")
    .addColumns({
        loanId : tm.mysql.bigIntSigned(),
        bookId : tm.mysql.varChar(255),
        dueAt : tm.mysql.dateTime(3),
        returnedAt : tm.mysql.dateTime(3).orNull(),
    })
    /**
     * A book may only be lent out once per loan.
     */
    .setPrimaryKey(columns => [
        columns.loanId,
        columns.bookId,
    ]);
const fine = tsql.table("fine")
    .addColumns({
        fineId : tm.mysql.bigIntSigned(),
        loanId : tm.mysql.bigIntSigned(),
        bookId : tm.mysql.varChar(255),
        amount : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(3),
        paidAt : tm.mysql.dateTime(3).orNull(),
    })
    /**
     * A `loanedBook` may incur multiple fines,
     * particularly if they are overdue and fines are ignored.
     */
    .setAutoIncrement(columns => columns.fineId)
    .addExplicitDefaultValue(columns => [
        columns.createdAt,
    ]);

const myQuery = tsql.from(fine)
    /**
     * You may substitute this for `.leftJoinUsingPrimaryKey()`
     */
    .innerJoinUsingPrimaryKey(
        tables => tables.fine,
        /**
         * Has primary key (loanId, bookId)
         */
        loanedBook
    );
```

The above is the same as writing,
```sql
FROM
    fine
INNER JOIN
    loanedBook
ON
    (fine.loanId = loanedBook.loanId) AND
    (fine.bookId = loanedBook.bookId)
```

-----

### `.innerJoinUsingCandidateKey()/.leftJoinUsingCandidateKey()`

You may also perform an equi-join using candidate keys of a table,
```ts
import * as tsql from "@tsql/tsql";
import * as tm from "type-mapping/fluent";

const reservation = tsql.table("reservation")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        roomId : tm.mysql.varChar(255),
        timeSlotId : tm.mysql.bigIntSigned(),
    })
    /**
     * A user may only have one reservation per time-slot
     */
    .addCandidateKey(columns => [
        columns.userId,
        columns.timeSlotId,
    ])
    /**
     * A room may only be reserved once per time-slot
     */
    .addCandidateKey(columns => [
        columns.roomId,
        columns.timeSlotId,
    ]);
const cateredFood = tsql.table("cateredFood")
    .addColumns({
        roomId : tm.mysql.varChar(255),
        timeSlotId : tm.mysql.bigIntSigned(),
        foodId : tm.mysql.bigIntSigned(),
        quantity : tm.mysql.bigIntSigned(),
    })
    /**
     * A reservation may have multiple kinds of food catered.
     * Each kind of food should only be recorded once per reservation.
     */
    .setPrimaryKey(columns => [
        columns.roomId,
        columns.timeSlotId,
        columns.foodId,
    ]);

const myQuery = tsql.from(cateredFood)
    /**
     * You may substitute this for `.leftJoinUsingCandidateKey()`
     */
    .innerJoinUsingCandidateKey(
        tables => tables.cateredFood,
        reservation,
        /**
         * Must be a candidate key of `reservation`
         */
        columns => [columns.roomId, columns.timeSlotId]
    );
```

The above is the same as writing,
```sql
FROM
    cateredFood
INNER JOIN
    reservation
ON
    (cateredFood.roomId = reservation.roomId) AND
    (cateredFood.timeSlotId = reservation.timeSlotId)
```

-----

### `INNER JOIN` vs `LEFT JOIN`

When a table is `INNER JOIN`'d we say that the table is a **non-nullable** join,
+ Non-nullable columns in the table **will not** have `NULL` values.
+ Nullable columns in the table may have `NULL` values.

When a table is `LEFT JOIN`'d we say that the table is a **nullable** join,
+ Non-nullable columns in the table **may** have `NULL` values.
+ Nullable columns in the table may have `NULL` values.

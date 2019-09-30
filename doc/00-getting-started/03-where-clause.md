### `WHERE` Clause

The `WHERE` clause lets you specify a condition rows must satisfy to be part of the result set.

-----

### 2-valued Logic vs 3-valued Logic

MySQL, PostgreSQL and SQLite allow conditions that evaluate to `NULL`.
The databases support 3-valued logic.

+ If a condition is `TRUE` for a row, it is included in the result set.
+ If a condition is `FALSE` or `NULL` for a row, it is **excluded** from the result set.

-----

This library is **highly opinionated** and **will not** allow 3-valued logic for the `WHERE` clause.

You should use `COALESCE()`/`IS TRUE`/`IS FALSE`/`IS UNKNOWN` to convert any `NULL` values
to `TRUE`/`FALSE`.

In general, allowing `NULL` values in the `WHERE` clause indicates sloppy logic.

-----

By forcing the `WHERE` clause to only allow 2-valued logic,
we make our queries safer by explicitly deciding how to handle potentially ambiguous cases.

-----

For example,
```sql
SELECT
    *
FROM
    person
WHERE
    (
        SELECT
            organDonationConsent.consented
        FROM
            organDonationConsent
        WHERE
            person.personId = organDonationConsent.personId
        ORDER BY
            organDonationConsent.occurredAt DESC
        LIMIT
            1
    )
```

The above query attempts to `SELECT` all `person`s that have `consented` to organ donation.

However, it is possible for the subquery in the `WHERE` clause to evaluate to `NULL`.
Particularly if the `person` has no matching rows in `organDonationConsent`.

-----

When the subquery evaluates to `NULL`, has the `person` consented to organ donation or not?

In some countries, the lack of explicit consent/refusal implies **consent**.
In others, it implies **refusal**.

If all `person`s lacking explicit consent/refusal are assumed to have `consented`,
then the above query will return fewer rows than expected!

If **consent** is implied, we should rewrite the query,
```sql
SELECT
    *
FROM
    person
WHERE
    -- If the `person` has no record of being consenting/refusing,
    -- we assume the `person` has `consented`
    COALESCE(
        (
            SELECT
                organDonationConsent.consented
            FROM
                organDonationConsent
            WHERE
                person.personId = organDonationConsent.personId
            ORDER BY
                organDonationConsent.occurredAt DESC
            LIMIT
                1
        ),
        TRUE
    )
```

-----

### `WHERE` Overview

The most basic method to build the `WHERE` clause,
+ `.where(whereDelegate)`

These methods build upon `.where()` to simplify common `WHERE` clause conditions,
+ `.whereEqPrimaryKey(tableDelegate, primaryKey)`
+ `.whereEqCandidateKey(tableDelegate, candidateKey)`
+ `.whereEqSuperKey(tableDelegate, superKey)`
+ `.whereEqColumns(tableDelegate, row)`
+ `.whereEqOuterQueryPrimaryKey(srcDelegate, dstDelegate)`

These methods let you **narrow** the type of columns in the `FROM` clause,
+ `.whereEq(columnDelegate, value)`
+ `.whereIsNotNull(columnDelegate)`
+ `.whereIsNull(columnDelegate)`
+ `.whereNullSafeEq(columnDelegate, value)`

-----

### `.where()`

An arbitrary `WHERE` clause may be specified with,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable`, `otherTable` elsewhere
 */
import {myTable, otherTable} from "./table";

const myQuery0 = tsql.from(myTable)
    /**
     * With only one table in the `FROM` clause,
     * we do not need to qualify columns with a table name.
     */
    .where(columns => tsql.gt(
        /**
         * This refers to `myTable.myColumn`
         */
        columns.myColumn,
        9000n
    ));
```

The above is the same as writing,
```sql
FROM
    myTable
WHERE
    myTable.myColumn > 9000
```

-----

```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable`, `otherTable` elsewhere
 */
import {myTable, otherTable} from "./table";

const myQuery = tsql.from(myTable)
    .innerJoinUsingPrimaryKey(
        tables => tables.myTable
        otherTable
    )
    /**
     * With multiple tables in the `FROM` clause,
     * we need to qualify columns with a table name.
     */
    .where(columns => tsql.and(
        tsql.gt(
            /**
             * This refers to `myTable.myColumn`
             */
            columns.myTable.myColumn,
            9000n
        ),
        tsql.eq(
            /**
             * This refers to `otherTable.otherColumn`
             */
            columns.otherTable.otherColumn,
            69n
        )
    ));
```

The above is the same as writing,
```sql
FROM
    myTable
INNER JOIN
    otherTable
ON
    -- innerJoinUsingPrimaryKey()
    -- Assume `otherTableId` is the primary key of `otherTable`
    myTable.otherTableId = otherTable.otherTableId
WHERE
    (myTable.myColumn > 9000) AND
    (otherTable.otherColumn = 69)
```

-----

You may call the `.where()` method repeatedly.
Each invocation `AND`s the current and new conditions.

```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable`, `otherTable` elsewhere
 */
import {myTable, otherTable} from "./table";

const myQuery = tsql.from(myTable)
    .innerJoinUsingPrimaryKey(
        tables => tables.myTable
        otherTable
    )
    /**
     * With multiple tables in the `FROM` clause,
     * we need to qualify columns with a table name.
     */
    .where(columns => tsql.gt(
        columns.myTable.myColumn,
        9000n
    ))
    .where(columns => tsql.eq(
        columns.otherTable.otherColumn,
        69n
    )
    .where(columns => tsql.isNotNull(
        columns.otherTable.otherColumn2
    );
```

The above is the same as writing,
```sql
FROM
    myTable
INNER JOIN
    otherTable
ON
    -- innerJoinUsingPrimaryKey()
    -- Assume `otherTableId` is the primary key of `otherTable`
    myTable.otherTableId = otherTable.otherTableId
WHERE
    (myTable.myColumn > 9000) AND
    (otherTable.otherColumn = 69) AND
    (otherTable.otherColumn2 IS NOT NULL)
```

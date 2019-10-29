### `INSERT`

This library supports a variety of ways to `INSERT` rows to a table.

-----

### `INSERT INTO ... VALUES ...` Overview

`INSERT`,
+ `table.insertOne()`
+ `table.insertMany()`
+ `table.insertAndFetch()`

`INSERT IGNORE`,
+ `table.insertIgnoreOne()`
+ `table.insertIgnoreMany()`

`REPLACE`,
+ `table.replaceOne()`
+ `table.replaceMany()`

-----

### `INSERT INTO ... SELECT ...` Overview

+ `query.insert()`
+ `query.insertIgnore()`
+ `query.replace()`

-----

### TODO

+ `... ON DUPLICATE KEY UPDATE`
  + Can reasonably be unified if the table only has one candidate key.
  + PostgreSQL only supports `ON CONFLICT` clause for one candidate key at a time.

-----

### `table.insertOne()`

Inserts a single row,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable` elsewhere
 */
import {myTable} from "./table";

const insertResult = await myTable.insertOne(
    connection,
    {
        //Column values can be literal values
        myColumn0 : 100n,
        //Column values can be expressions
        //`CURRENT_TIMESTAMP(0)`
        myColumn1 : tsql.currentTimestamp0(),
    }
);
```

The above is the same as writing,
```sql
INSERT INTO
    myTable (myColumn0, myColumn1)
VALUES
    (100, CURRENT_TIMESTAMP(0))
```

-----

If `table` has an auto-increment column,
the `insertResult` will contain the auto-increment value,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable` elsewhere.
 * Assume the auto-increment column name is `myTableId`.
 */
import {myTable} from "./table";

const insertResult = await myTable.insertOne(
    connection,
    {
        //Column values can be literal values
        myColumn0 : 100n,
        //Column values can be expressions
        //`CURRENT_TIMESTAMP(0)`
        myColumn1 : tsql.currentTimestamp0(),
    }
);
//Should be some `bigint` value.
console.log(insertResult.autoIncrementId);
//Should be some `bigint` value.
//Convenience property for `autoIncrementId`.
console.log(insertResult.myTableId);
```

-----

### `table.insertMany()`

Inserts multiple rows,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable` elsewhere
 */
import {myTable} from "./table";

const insertResult = await myTable.insertMany(
    connection,
    [
        {
            //Column values can be literal values
            myColumn0 : 100n,
            //Column values can be expressions
            //`CURRENT_TIMESTAMP(0)`
            myColumn1 : tsql.currentTimestamp0(),
        },
        //...
        //snip, you may have more rows here.
    ]
);
```

The above is the same as writing,
```sql
INSERT INTO
    myTable (myColumn0, myColumn1)
VALUES
    (100, CURRENT_TIMESTAMP(0)),
    -- ...
    -- snip you may have more rows here.
```

If the array is empty, it does not access the database at all,
because there is nothing to `INSERT`.

-----

### `table.insertAndFetch()`

Like `table.insertOne()`, but it returns the inserted row.
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable` elsewhere.
 * Assume the auto-increment column name is `myTableId`.
 */
import {myTable} from "./table";

const myRow = await myTable.insertOne(
    connection,
    {
        //Column values can be literal values
        myColumn0 : 100n,
        //Column values can be expressions
        //`CURRENT_TIMESTAMP(0)`
        myColumn1 : tsql.currentTimestamp0(),
    }
);
console.log(myRow.myTableId);
console.log(myRow.myColumn0);
console.log(myRow.myColumn1);
```

Internally, it calls `connection.transactionIfNotInOne(callback)`.
Then, inside the callback, it executes an `INSERT` and `SELECT` statement.

If the transaction commits successfully, the row is returned.

-----

### `table.insertIgnoreOne()`

Like `table.insertOne()`, but performs `INSERT IGNORE` instead.

-----

### `table.insertIgnoreMany()`

Like `table.insertMany()`, but performs `INSERT IGNORE` instead.

-----

### `table.replaceOne()`

Like `table.insertOne()`, but performs `REPLACE` instead.

-----

### `table.replaceMany()`

Like `table.insertMany()`, but performs `REPLACE` instead.

-----

### `query.insert()`

Inserts a result set into a table,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `src`, and `dst` elsewhere.
 */
import {src, dst} from "./table";

const insertResult = await tsql
    .from(src)
    .select(columns => [
        columns.testId,
        tsql.integer.add(
            columns.testVal,
            BigInt(50)
        ).as("sum")
    ])
    .insert(
        connection,
        dst,
        columns => {
            return {
                testId : columns.src.testId,
                testVal : columns.__aliased.sum,
            };
        }
    );
```

The above is the same as writing,
```sql
INSERT INTO
    dst (testId, testVal)
SELECT
    src.testId, (src.testVal + 50)
FROM
    src
```

-----

### `query.insertIgnore()`

Like `query.insert()`, but performs `INSERT IGNORE` instead.

-----

### `query.replace()`

Like `query.insert()`, but performs `REPLACE` instead.

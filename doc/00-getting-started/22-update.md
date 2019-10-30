### `UPDATE`

This library supports a variety of ways to `UPDATE` rows of a table.

-----

### Overview

These methods allow `UPDATE` statements to have arbitrary `WHERE` clauses,
+ `table.update()`
+ `table.updateOne()`
+ `table.updateZeroOrOne()`

These convenience methods build upon `table.updateOne()`,
+ `table.updateOneByPrimaryKey()`
+ `table.updateOneByCandidateKey()`
+ `table.updateOneBySuperKey()`

These convenience methods build upon `table.updateZeroOrOne()`,
+ `table.updateZeroOrOneByPrimaryKey()`
+ `table.updateZeroOrOneByCandidateKey()`
+ `table.updateZeroOrOneBySuperKey()`

These convenience methods build upon `table.updateOne()`, and fetch the updated row,
+ `table.updateAndFetchOneByPrimaryKey()`
+ `table.updateAndFetchOneByCandidateKey()`
+ `table.updateAndFetchOneBySuperKey()`

These convenience methods build upon `table.updateZeroOrOne()`, and fetch the updated row, if any,
+ `table.updateAndFetchZeroOrOneByPrimaryKey()`
+ `table.updateAndFetchZeroOrOneByCandidateKey()`
+ `table.updateAndFetchZeroOrOneBySuperKey()`

-----

### `AssignmentMapDelegate`

The `AssignmentMapDelegate` type looks something like this,
```ts
type AssignmentMap<TableT, AssignmentMapT> =
    (columns : TableT["columns"]) => AssignmentMapT
;
```

The `AssignmentMap` returned affects what columns are updated, and what the new values will be.

-----

### `table.update()`

Lets you `UPDATE` zero-to-many rows, using an arbitrary `WHERE` clause,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable` elsewhere
 */
import {myTable} from "./table";

const updateResult = await myTable.update(
    connection,
    columns => tsql.gt(
        columns.column0,
        BigInt(199)
    ),
    //This is our `AssignmentMapDelegate`
    columns => {
        //This is our `AssignmentMap`
        return {
            //Column values can be literal values
            column0 : 50n,
            //Column values can be expressions
            column1 : tsql.integer.add(
                columns.column1,
                100n
            ),
        };
    }
);
```

The above is the same as writing,
```sql
UPDATE
    myTable
SET
    myTable.column0 = 50,
    myTable.column1 = myTable.column1 + 100
WHERE
    myTable.column0 > 199
```

-----

### `table.updateOne()`

Like `table.update()`, but ensures exactly one row is updated.

Internally, it calls `connection.transactionIfNotInOne(callback)`.
Then, inside the callback, it executes an `UPDATE` statement.

+ If zero rows are updated, it throws a `RowNotFoundError`.
+ If more than one row is updated, it throws a `TooManyRowsFoundError`.
+ If exactly one row is updated, it returns.

-----

### `table.updateZeroOrOne()`

Like `table.update()`, but ensures exactly zero, or one row is updated.

Internally, it calls `connection.transactionIfNotInOne(callback)`.
Then, inside the callback, it executes an `UPDATE` statement.

+ If more than one row is updated, it throws a `TooManyRowsFoundError`.
+ If exactly zero, or one row is updated, it returns.

-----

### `table.updateOneByPrimaryKey()`

Every table **should** have one primary key.
The primary key may be made up of one, or more, columns.

Uses `table.updateOne()` internally,
```ts
const updateResult = await myTable.updateOneByPrimaryKey(
    connection,
    {
        myTablePrimaryKey0,
        myTablePrimaryKey1,
        //etc.
    },
    //This is our `AssignmentMapDelegate`
    columns => {
        //This is our `AssignmentMap`
        return {
            //Column values can be literal values
            column0 : 50n,
            //Column values can be expressions
            column1 : tsql.integer.add(
                columns.column1,
                100n
            ),
        };
    }
);
```

Convenience method for,
```ts
const updateResult = await myTable.updateOne(
    connection,
    () => tsql.eqPrimaryKey(
        myTable,
        {
            myTablePrimaryKey0,
            myTablePrimaryKey1,
            //etc.
        }
    ),
    //This is our `AssignmentMapDelegate`
    columns => {
        //This is our `AssignmentMap`
        return {
            //Column values can be literal values
            column0 : 50n,
            //Column values can be expressions
            column1 : tsql.integer.add(
                columns.column1,
                100n
            ),
        };
    }
);
```

-----

### `table.updateOneByCandidateKey()`

A primary key **should** be a kind of candidate key.
Therefore, every table **should** have one, or more, candidate keys.
A candidate key may be made up of one, or more, columns.

Uses `table.updateOne()` internally,
```ts
const updateResult = await myTable.updateOneByCandidateKey(
    connection,
    {
        myTableCandidateKey0,
        myTableCandidateKey1,
        //etc.
    },
    //This is our `AssignmentMapDelegate`
    columns => {
        //This is our `AssignmentMap`
        return {
            //Column values can be literal values
            column0 : 50n,
            //Column values can be expressions
            column1 : tsql.integer.add(
                columns.column1,
                100n
            ),
        };
    }
);
```

Convenience method for,
```ts
const updateResult = await myTable.updateOne(
    connection,
    () => tsql.eqCandidateKey(
        myTable,
        {
            myTableCandidateKey0,
            myTableCandidateKey1,
            //etc.
        }
    ),
    //This is our `AssignmentMapDelegate`
    columns => {
        //This is our `AssignmentMap`
        return {
            //Column values can be literal values
            column0 : 50n,
            //Column values can be expressions
            column1 : tsql.integer.add(
                columns.column1,
                100n
            ),
        };
    }
);
```

-----

### `table.updateOneBySuperKey()`

A super key is made up of a candidate key and zero, or more, non-key columns.

Uses `table.updateOne()` internally,
```ts
const updateResult = await myTable.updateOneBySuperKey(
    connection,
    {
        myTableCandidateKey0,
        myTableCandidateKey1,
        //etc.
        nonKey0,
        nonKey1,
        //etc.
    },
    //This is our `AssignmentMapDelegate`
    columns => {
        //This is our `AssignmentMap`
        return {
            //Column values can be literal values
            column0 : 50n,
            //Column values can be expressions
            column1 : tsql.integer.add(
                columns.column1,
                100n
            ),
        };
    }
);
```

Convenience method for,
```ts
const updateResult = await myTable.updateOne(
    connection,
    () => tsql.eqSuperKey(
        myTable,
        {
            myTableCandidateKey0,
            myTableCandidateKey1,
            //etc.
            nonKey0,
            nonKey1,
            //etc.
        }
    ),
    //This is our `AssignmentMapDelegate`
    columns => {
        //This is our `AssignmentMap`
        return {
            //Column values can be literal values
            column0 : 50n,
            //Column values can be expressions
            column1 : tsql.integer.add(
                columns.column1,
                100n
            ),
        };
    }
);
```

-----

### `table.updateZeroOrOneByPrimaryKey()`

Like `table.updateOneByPrimaryKey()`, but uses `table.updateZeroOrOne()` internally.

-----

### `table.updateZeroOrOneByCandidateKey()`

Like `table.updateOneByCandidateKey()`, but uses `table.updateZeroOrOne()` internally.

-----

### `table.updateZeroOrOneBySuperKey()`

Like `table.updateOneBySuperKey()`, but uses `table.updateZeroOrOne()` internally.

-----

### `table.updateAndFetchOneByPrimaryKey()`

Like `table.updateOneByPrimaryKey()`, but the returned result has a `row` property.
This `row` property contains the updated row with its new values.
```ts
const updateResult = await myTable.updateAndFetchOneByPrimaryKey(
    //snip
);
/*
    {
        myTableId : //value,
        column0 : //value,
        column1 : //value,
    }
*/
console.log(updateResult.row);
```

-----

### `table.updateAndFetchOneByCandidateKey()`

Similar to `table.updateAndFetchOneByPrimaryKey()`, but for candidate keys.

-----

### `table.updateAndFetchOneBySuperKey()`

Similar to `table.updateAndFetchOneByPrimaryKey()`, but for super keys.

-----

### `table.updateAndFetchZeroOrOneByPrimaryKey()`

Like `table.updateAndFetchOneByPrimaryKey()`, but the `row` property of the returned result
is `undefined` when no rows are found.
```ts
const updateResult = await myTable.updateAndFetchZeroOrOneByPrimaryKey(
    //snip
);
/*
    Might be,
    {
        myTableId : //value,
        column0 : //value,
        column1 : //value,
    }

    Might be,
    undefined
*/
console.log(updateResult.row);
```

-----

### `table.updateAndFetchZeroOrOneByCandidateKey()`

Similar to `table.updateAndFetchZeroOrOneByPrimaryKey()`, but for candidate keys.

-----

### `table.updateAndFetchZeroOrOneBySuperKey()`

Similar to `table.updateAndFetchZeroOrOneByPrimaryKey()`, but for super keys.

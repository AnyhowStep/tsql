### `DELETE`

This library supports a variety of ways to `DELETE` rows from a table.

-----

### Overview

These methods allow `DELETE` statements to have arbitrary `WHERE` clauses,
+ `table.delete()`
+ `table.deleteOne()`
+ `table.deleteZeroOrOne()`

These convenience methods build upon `table.deleteOne()`,
+ `table.deleteOneByPrimaryKey()`
+ `table.deleteOneByCandidateKey()`
+ `table.deleteOneBySuperKey()`

These convenience methods build upon `table.deleteZeroOrOne()`,
+ `table.deleteZeroOrOneByPrimaryKey()`
+ `table.deleteZeroOrOneByCandidateKey()`
+ `table.deleteZeroOrOneBySuperKey()`

-----

### `table.delete()`

Lets you `DELETE` zero-to-many rows, using an arbitrary `WHERE` clause,
```ts
import * as tsql from "@tsql/tsql";
/**
 * Assume we already defined `myTable` elsewhere
 */
import {myTable} from "./table";

const deleteResult = await myTable.delete(
    connection,
    columns => tsql.gt(
        columns.column0,
        BigInt(199)
    )
);
```

The above is the same as writing,
```sql
DELETE FROM
    myTable
WHERE
    myTable.column0 > 199
```

-----

### `table.deleteOne()`

Like `table.delete()`, but ensures exactly one row is deleted.

Internally, it calls `connection.transactionIfNotInOne(callback)`.
Then, inside the callback, it executes a `DELETE` statement.

+ If zero rows are deleted, it throws a `RowNotFoundError`.
+ If more than one row is deleted, it throws a `TooManyRowsFoundError`.
+ If exactly one row is deleted, it returns.

-----

### `table.deleteZeroOrOne()`

Like `table.delete()`, but ensures exactly zero, or one row is deleted.

Internally, it calls `connection.transactionIfNotInOne(callback)`.
Then, inside the callback, it executes a `DELETE` statement.

+ If more than one row is deleted, it throws a `TooManyRowsFoundError`.
+ If exactly zero, or one row is deleted, it returns.

-----

### `table.deleteOneByPrimaryKey()`

Every table **should** have one primary key.
The primary key may be made up of one, or more, columns.

Uses `table.deleteOne()` internally,
```ts
const deleteResult = await myTable.deleteOneByPrimaryKey(
    connection,
    {
        myTablePrimaryKey0,
        myTablePrimaryKey1,
        //etc.
    }
);
```

Convenience method for,
```ts
const deleteResult = await myTable.deleteOne(
    connection,
    () => tsql.eqPrimaryKey(
        myTable,
        {
            myTablePrimaryKey0,
            myTablePrimaryKey1,
            //etc.
        }
    )
);
```

-----

### `table.deleteOneByCandidateKey()`

A primary key **should** be a kind of candidate key.
Therefore, every table **should** have one, or more, candidate keys.
A candidate key may be made up of one, or more, columns.

Uses `table.deleteOne()` internally,
```ts
const deleteResult = await myTable.deleteOneByCandidateKey(
    connection,
    {
        myTableCandidateKey0,
        myTableCandidateKey1,
        //etc.
    }
);
```

Convenience method for,
```ts
const deleteResult = await myTable.deleteOne(
    connection,
    () => tsql.eqCandidateKey(
        myTable,
        {
            myTableCandidateKey0,
            myTableCandidateKey1,
            //etc.
        }
    )
);
```

-----

### `table.deleteOneBySuperKey()`

A super key is made up of a candidate key and zero, or more, non-key columns.

Uses `table.deleteOne()` internally,
```ts
const deleteResult = await myTable.deleteOneBySuperKey(
    connection,
    {
        myTableCandidateKey0,
        myTableCandidateKey1,
        //etc.
        nonKey0,
        nonKey1,
        //etc.
    }
);
```

Convenience method for,
```ts
const deleteResult = await myTable.deleteOne(
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
    )
);
```

-----

### `table.deleteZeroOrOneByPrimaryKey()`

Like `table.deleteOneByPrimaryKey()`, but uses `table.deleteZeroOrOne()` internally.

-----

### `table.deleteZeroOrOneByCandidateKey()`

Like `table.deleteOneByCandidateKey()`, but uses `table.deleteZeroOrOne()` internally.

-----

### `table.deleteZeroOrOneBySuperKey()`

Like `table.deleteOneBySuperKey()`, but uses `table.deleteZeroOrOne()` internally.

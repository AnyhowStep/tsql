### `.fetchOneXxx()`

The `.fetchOneXxx()` methods fetch a single row, at most.

-----

### Overview

+ `.fetchOne()`
+ `.fetchOneOr()`
+ `.fetchOneOrUndefined()`

-----

### TODO?

Maybe implement the following?

+ `.fetchOneUnmapped()`
+ `.fetchOneUnmappedFlattened()`
+ `.fetchOneMapped()`

+ `.fetchOneUnmappedOr()`
+ `.fetchOneUnmappedFlattenedOr()`
+ `.fetchOneMappedOr()`

+ `.fetchOneUnmappedOrUndefined()`
+ `.fetchOneUnmappedFlattenedOrUndefined()`
+ `.fetchOneMappedOrUndefined()`

-----

### `.fetchOne()`

Attempts to fetch exactly one row.

+ If zero rows are fetched, a `tsql.RowNotFoundError` is thrown.
+ If two (or more) rows are fetched, a `tsql.TooManyRowsFoundError` is thrown.
+ The shape of the row follows the behaviour of [`fetchAll()`](/doc/00-getting-started/11-fetch-all-xxx.md#fetchall)

-----

### `.fetchOneOr(connection, defaultValue)`

Attempts to fetch exactly one row.

+ If zero rows are fetched, `defaultValue` is returned.
+ If two (or more) rows are fetched, a `tsql.TooManyRowsFoundError` is thrown.
+ The shape of the row follows the behaviour of [`fetchAll()`](/doc/00-getting-started/11-fetch-all-xxx.md#fetchall)

-----

### `.fetchOneOrUndefined()`

Convenience method for `.fetchOneOr(connection, undefined)`.

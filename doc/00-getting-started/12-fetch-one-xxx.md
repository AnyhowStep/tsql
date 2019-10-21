### `.fetchOneXxx()`

The `.fetchOneXxx()` methods fetch a single row, at most.

-----

### Overview

+ `.fetchOne()`
+ `.fetchOneOr()`
+ `.fetchOneOrUndefined()`

-----

### `.fetchOne()`

Attempts to fetch exactly one row.

If zero rows are fetched, a `tsql.RowNotFoundError` is thrown.

If two (or more) rows are fetched, a `tsql.TooManyRowsFoundError` is thrown.

-----

### `.fetchOneOr(connection, defaultValue)`

Attempts to fetch exactly one row.

If zero rows are fetched, `defaultValue` is returned.

If two (or more) rows are fetched, a `tsql.TooManyRowsFoundError` is thrown.

-----

### `.fetchOneOrUndefined()`

Convenience method for `.fetchOneOr(connection, undefined)`.

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

-----

### `ExecutionUtil.FetchOnePromise<>`

`.fetchOne()` actually returns a value of type [`ExecutionUtil.FetchOnePromise<>`](/src/execution/util/operation/fetch-one.ts#L5-L8)

It is essentially the same as `Promise<>`, with two extra methods,

+ `.or(defaultValue)`

  Behaves the same as `.fetchOneOr()`

  ```ts
  myQuery
      .fetchOne(connection)
      .or(1337)
      .then((row) => {
          if (row == 1337) {
              //No row was fetched
          } else {
              //A row was fetched
          }
      });
  ```

+ `.orUndefined()`

  Behaves the same as `.fetchOneOrUndefined()`

  ```ts
  myQuery
      .fetchOne(connection)
      .orUndefined()
      .then((row) => {
          if (row == undefined) {
              //No row was fetched
          } else {
              //A row was fetched
          }
      });
  ```

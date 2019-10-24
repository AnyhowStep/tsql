### `.fetchValueXxx()`

+ `.fetchValueXxx()` ignores all previous calls to `.map()`
+ `.fetchValueXxx()` may only be called if the `SELECT` clause is of length **one** and a column or aliased expression is selected.

-----

The `.fetchValueXxx()` methods fetch a single row, at most.

-----

### Overview

+ `.fetchValue()`
+ `.fetchValueOr()`
+ `.fetchValueOrUndefined()`

-----

### `.fetchValue()`

Convenience method for,
```ts
const row : { myColumn : bigint } = await tsql
    .from(myTable)
    .select(columns => [columns.myColumn])
    .fetchOne(connection);

const bigintValue : bigint = row.myColumn;
```

Usage,
```ts
const bigintValue : bigint = await tsql
    .from(myTable)
    .select(columns => [columns.myColumn])
    .fetchValue(connection);
```

-----

### `.fetchValueOr(connection, defaultValue)`

Convenience method for,
```ts
const row : { myColumn : bigint }|string = await tsql
    .from(myTable)
    .select(columns => [columns.myColumn])
    .fetchOneOr(connection, "whoops, no value");

const bigintOrStringValue : bigint|string = (
    typeof row == "string" ?
    row :
    row.myColumn
);
```

Usage,
```ts
const bigintOrStringValue : bigint|string = await tsql
    .from(myTable)
    .select(columns => [columns.myColumn])
    .fetchValueOr(connection, "whoops, no value");
```

-----

### `.fetchValueOrUndefined()`

Convenience method for `.fetchValueOr(connection, undefined)`.

-----

### `ExecutionUtil.FetchValuePromise<>`

`.fetchValue()` actually returns a value of type [`ExecutionUtil.FetchValuePromise<>`](/src/execution/util/operation/fetch-value.ts#L5-L8)

It is essentially the same as `Promise<>`, with two extra methods,

+ `.or(defaultValue)`

  Behaves the same as `.fetchValueOr()`

  ```ts
  myQuery
      .fetchValue(connection)
      .or(1337)
      .then((value) => {
          if (value == 1337) {
              //No value was fetched... Or the value fetched is 1337
          } else {
              //A value was fetched
          }
      });
  ```

+ `.orUndefined()`

  Behaves the same as `.fetchValueOrUndefined()`

  ```ts
  myQuery
      .fetchValue(connection)
      .orUndefined()
      .then((value) => {
          if (value == undefined) {
              //No value was fetched
          } else {
              //A value was fetched
          }
      });
  ```

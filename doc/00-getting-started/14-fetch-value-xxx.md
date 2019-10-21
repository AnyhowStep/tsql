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

### `SELECT`

The `Log` class has helper methods for selecting rows.

-----

### Overview

+ `exists()`

These methods fetch a row,
+ `fetchDefault()`
+ `fetchLatest()`
+ `fetchLatestOrDefault()`

These methods fetch a single value,
+ `fetchLatestValue()`
+ `fetchLatestValueOrDefault()`

-----

### `exists()`

This method tells you if an entity, identified by `ownerPrimaryKey`,
has any rows in the `logTable`.

Usage,
```ts
/**
 * If `true`, at least one row in the `logTable` belongs
 * to the entity.
 *
 * If `false`, the entity has no rows in the `logTable`.
 */
const exists : boolean = await myLog.exists(
    connection,
    ownerPrimaryKey
);
```

-----

### `fetchDefault()`

Usage,
```ts
/**
 * If `true`, at least one row in the `logTable` belongs
 * to the entity.
 *
 * If `false`, the entity has no rows in the `logTable`.
 */
const exists : boolean = await myLog.exists(
    connection,
    ownerPrimaryKey
);
```

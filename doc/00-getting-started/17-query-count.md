### `query.count()`

Convenience method for,
```ts
const count : bigint = await tsql
    .selectValue(() => tsql.countAll())
    .from(myQuery.as("tmp"))
    .fetchValue(connection);
```

-----

### Usage

```ts
const count : bigint = await myQuery
    .count(connection);
```

### `query.exists()`

Convenience method for,
```ts
const exists : boolean = await tsql
    .selectValue(() => tsql.exists(myQuery))
    .fetchValue(connection);
```

-----

### Usage

```ts
const exists : boolean = await myQuery
    .exists(connection);
```

-----

### `query.assertExists()`

Convenience method for,
```ts
const exists : boolean = await myQuery
    .exists(connection);
if (!exists) {
    throw new tsql.RowNotFoundError(/*message*/);
}
```

-----

### Usage

```ts
await myQuery
    .assertExists(connection);
```

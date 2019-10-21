### `.fetchValueArray()`

+ `.fetchValueArray()` ignores all previous calls to `.map()`
+ `.fetchValueArray()` may only be called if the `SELECT` clause is of length **one** and a column or aliased expression is selected.

-----

At times, you may write the following,
```ts
const rows : { myColumn : bigint }[] = await tsql
    .from(myTable)
    .select(columns => [columns.myColumn])
    .fetchAll(connection);

const bigintArr : bigint[] = rows
    .map(row => row.myColumn);
```

With `.fetchValueArray()`, you may write,
```ts
const bigintArr : bigint[] = await tsql
    .from(myTable)
    .select(columns => [columns.myColumn])
    .fetchValueArray(connection);
```

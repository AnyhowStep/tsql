### `.paginate(connection, rawPaginateArgs)`

A helper method to implement pagination.

-----

### `RawPaginateArgs`

The `RawPaginateArgs` interface looks like,
```ts
/**
 * Better to use `bigint`.
 *
 * `9223372036854775807n` cannot be represented using a `double`.
 *
 * It gets rounded to `9223372036854776000`
 */
export interface RawPaginateArgs {
    /**
     * The page to fetch.
     * The first page is zero.
     */
    page? : number|bigint,
    /**
     * The number of rows to fetch per page.
     * You should control this value.
     *
     * If `rowsPerPage` is too high, and too many rows are fetched,
     * it may cause an out-of-memory exception!
     */
    rowsPerPage? : number|bigint,
    /**
     * When positive, lets you skip the first `rowOffset` rows.
     * Has no effect when negative or zero.
     */
    rowOffset? : number|bigint,
}
```

`.paginate(connection, rawPaginateArgs)` will try to process the `rawPaginateArgs` into a usable form,
using the [`toPaginateArgs()` function](/src/execution/util/operation/paginate/paginate-args.ts#L32-L59)

-----

### Return Type

The return type of `.paginate()` looks like,
```ts
declare const paginateResult : {
    info : {
        rowsFound : bigint,
        pagesFound : bigint,
        page : bigint,
        rowsPerPage : bigint,
        rowOffset : bigint,
    },
    rows : RowT[],
};
```

-----

### Recommended Usage

```ts
const paginateResult = await tsql
    .from(myTable)
    .select(columns => [columns])
    /**
     * You should always have an `ORDER BY` clause when using `.paginate()`.
     * Otherwise, the order of rows is not defined.
     *
     * The `ORDER BY` clause should also result in a **unique** ordering,
     * or your results may be inconsistent.
     */
    .orderBy(columns => [
        columns.createdAt.desc(),
        columns.myTableId.desc(),
    ])
    .paginate(connection, {
        /**
         * The first page is zero.
         */
        page : 0n,
        /**
         * 100 seems like a good number of rows per page.
         */
        rowsPerPage : 100n,
    });
```

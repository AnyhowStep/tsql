### `.fetchAllXxx()`

The `.fetchAllXxx()` methods fetch an array of rows.

-----

### Overview

+ `.fetchAllUnmapped()`
+ `.fetchAllUnmappedFlattened()`
+ `.fetchAllMapped()`
+ `.fetchAll()`

-----

### `.fetchAllUnmapped()`

When using `.fetchAllUnmapped()`, all previous calls to `.map()` are ignored and unmapped rows are returned.

It's like `.map()` was never called.

An unmapped row might look like,
```ts
declare const row : {
    //table alias
    myTable : {
        //column alias
        myColumn : bigint,
    },
    //table alias
    otherTable : {
        //column alias
        otherColumn : bigint,
    },
};
```

-----

### `.fetchAllUnmappedFlattened()`

If a query has [nullable joins](/doc/00-getting-started/02-from-clause.md#inner-join-vs-left-join),
or has duplicate aliases in the `SELECT` clause,
then this returns the same result as `.fetchAllUnmapped()`.

If it has no nullable joins and no duplicate aliases in the `SELECT` clause,
it tries to remove table aliases from the row.

An unmapped flattened row might look like,
```ts
declare const row : {
    //column alias
    myColumn : bigint,
    //column alias
    otherColumn : bigint,
};
```

-----

### `.fetchAllMapped()`

This may only be called after [`.map()`](/doc/00-getting-started/10-map.md) has been called.

It will fetch all rows, and run each row through the mapper(s).

-----

### `.fetchAll()`

If called after `.map()`, it behaves like `.fetchAllMapped()`.
Otherwise, it behaves like `.fetchAllUnmappedFlattened()`.

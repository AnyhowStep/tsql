### `INSERT`

The `Log` class has helper methods for inserting new rows,
if these new rows satisfy some constraints.

-----

### Overview

+ `unsafeTrack()`
+ `trackOrInsert()`
+ `track()`

-----

### `TrackResult`

All the `INSERT` helpers return a [`TrackResult`](/src/design-pattern-log/util/execution/track-result.ts)

The `changed : boolean` property tells you if a new row was inserted, or not.

-----

### Change Detection

When using any of the `INSERT` helpers, a new row may or may not be inserted.

If a "change" between the previous row, and new row is detected,
then a new row is inserted.

Otherwise, the new row is ignored, and not inserted.

-----

The change detection algorithm only looks at `tracked` columns.

If no previous row exists, the values from `trackedDefaults` are used.

For each `tracked` column,
+ If a new value is specified,
  + Are the new and previous values different?
    + If so, a change is detected.
    + If not, look at other `tracked` columns.
+ If a new value is not specified,
  + Look at other `tracked` columns.

After looking through all `tracked` columns,
if at least one change is detected,
then the new row is inserted.

Unchanged values are copied over, from the previous row, to the new row.

-----

### `unsafeTrack()`

If all `tracked` columns have default values in `trackedDefaults`,
then this method is **safe** to use.

However, you should just use the `track()` method instead,
as they will both behave the same way.

-----

If some `tracked` columns **do not** have default values in `trackedDefaults`,
+ This is the **least restrictive** of the `INSERT` helpers.
+ This is also the **least safe**.

-----

Usage,
```ts
const trackResult = await myLog.unsafeTrack(
    connection,
    ownerPrimaryKey,
    {
        /**
         * `tracked` columns with `trackedDefaults` are optional.
         *
         * If unset, the library will use the previous row's value.
         * If a previous row does not exist, the value from `trackedDefaults` is used instead.
         *
         * -----
         *
         * `tracked` columns **without** `trackedDefaults` **should** always have values set.
         * However, `unsafeTrack()` allows you to pass `undefined` to these columns instead.
         *
         * When you do so, the library will use the previous row's value.
         * If a previous row does not exist, **you will get a run-time error**.
         */
        trackedColumn0 : trackedValue0,
        trackedColumn1 : trackedValue1,
        trackedColumn2 : trackedValue2,
        //snip

        //`doNotCopy` columns may be optional if they have implicit/explicit default values
        doNotCopyColumn0 : doNotCopyValue0,
        doNotCopyColumn1 : doNotCopyValue1,
        doNotCopyColumn2 : doNotCopyValue2,
        //snip
    }
);
```

-----

### `trackOrInsert()`

If all `tracked` columns have default values in `trackedDefaults`,
you should just use the `track()` method instead,
as they will both behave the same way.

-----

If some `tracked` columns **do not** have default values in `trackedDefaults`,
+ This is the **most restrictive** of the `INSERT` helpers.
+ This is also the **most safe**.

-----

Usage,
```ts
const trackResult = await myLog.trackOrInsert(
    connection,
    ownerPrimaryKey,
    {
        /**
         * `tracked` columns with `trackedDefaults` are optional.
         *
         * If unset, the library will use the previous row's value.
         * If a previous row does not exist, the value from `trackedDefaults` is used instead.
         *
         * -----
         *
         * `tracked` columns **without** `trackedDefaults` must always have values set.
         *
         * This is why this method is so restrictive.
         */
        trackedColumn0 : trackedValue0,
        trackedColumn1 : trackedValue1,
        trackedColumn2 : trackedValue2,
        //snip

        //`doNotCopy` columns may be optional if they have implicit/explicit default values
        doNotCopyColumn0 : doNotCopyValue0,
        doNotCopyColumn1 : doNotCopyValue1,
        doNotCopyColumn2 : doNotCopyValue2,
        //snip
    }
);
```

-----

### `track()`

This method may only be used when **all** `tracked` columns have default values in `trackedDefaults`.

This is the method you want to use, as much as possible.

-----

Usage,
```ts
const trackResult = await myLog.track(
    connection,
    ownerPrimaryKey,
    {
        /**
         * Since all `tracked` columns have `trackedDefaults`,
         * all `tracked` columns are optional.
         */
        trackedColumn0 : trackedValue0,
        trackedColumn1 : trackedValue1,
        trackedColumn2 : trackedValue2,
        //snip

        //`doNotCopy` columns may be optional if they have implicit/explicit default values
        doNotCopyColumn0 : doNotCopyValue0,
        doNotCopyColumn1 : doNotCopyValue1,
        doNotCopyColumn2 : doNotCopyValue2,
        //snip
    }
);
```

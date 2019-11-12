### Overview

To use the `log` design pattern helper, we will need two tables,
+ The `logTable` contains the time-series data.

  It tracks the values of attributes over time.

+ The `ownerTable` contains entities whose attributes are being tracked.

Additional constraints exist, but they will be documented below.
Most of these constraints were added due to personal use cases.
Therefore, the constraints may prove unsuitable for your use cases.

-----

### Example Use Case

Imagine we are conducting a study.
We would like to track the lightbulb usage of households over time.

During the study, we assume no one will switch on/off lighbulbs in a household,
except for the people who live there (occupants).

We will have the following tables,
+ `household`

  + A `household` may have one-to-many `occupant`s living in it.
  + A `household` may have one-to-many `lightbulb`s installed.

+ `occupant`

  + An `occupant` lives in one `household`.

+ `lightbulb`

  + A `lightbulb` is installed in one `household`.

+ `lightbulbState`

  This is our `logTable`.

  + A `lightbulbState` describes one `lightbulb`.
  + A `lightbulbState` is changed by one `occupant`.
  + A `lightbulbState` may only be changed if the `occupant` and `lightbulb` belong to the same `household`.`(*)`
  + Every time the `lightbulbState` is changed, we add a new row to the table.

In order to enforce the constraint marked `(*)`, we will need the following foreign keys on `lightbulbState`,
+ `(lightbulbId, householdId) REFERENCES lightbulb(lightbulbId, householdId)`
+ `(occupantId, householdId) REFERENCES occupant(occupantId, householdId)`

-----

We will only care about the `lightbulb` (`ownerTable`) and `lightbulbState` (`logTable`) tables,
```ts
import * as tsql from "@tsql/tsql";
import * as tm from "type-mapping/fluent";

/**
 * Our `ownerTable`.
 */
const lightbulb = tsql.table("lightbulb")
    .addColumns({
        /**
         * The primary key of the `lightbulb` table
         */
        lightbulbId : tm.mysql.bigIntSigned(),
        /**
         * A `lightbulb` is installed in one `household`.
         */
        householdId : tm.mysql.bigIntSigned(),
        /**
         * Describes where the lightbulb is, in the household.
         */
        locationDescription : tm.mysql.varChar(255),
    })
    .setAutoIncrement(columns => columns.lightbulbId);

/**
 * Our `logTable`. It tracks when a lightbulb is switched on and off.
 */
const lightbulbState = tsql.table("lightbulbState")
    .addColumns({
        /**
         * A surrogate primary key for the `logTable`.
         * Not necessary. But recommended.
         */
        lightbulbStateId : tm.mysql.bigIntSigned(),
        /**
         * A `lightbulbState` describes one `lightbulb`.
         */
        lightbulbId : tm.mysql.bigIntSigned(),
        /**
         * A `lightbulbState` is changed by one `occupant`.
         */
        occupantId : tm.mysql.bigIntSigned(),
        /**
         * A `lightbulbState` may only be changed if the `occupant` and `lightbulb`
         * belong to the same `household`.`(*)`
         */
        householdId : tm.mysql.bigIntSigned(),
        /**
         * Is the `lightbulb` switched on?
         */
        switchedOn : tm.mysql.boolean(),
        /**
         * When was this `lightbulb` switched on?
         */
        loggedAt : tm.mysql.dateTime(3),
    })
    .addExplicitDefaultValue(columns => [
        /**
         * Assume this has a `DEFAULT` value of `CURRENT_TIMESTAMP(3)`
         */
        columns.loggedAt,
    ])
    .setAutoIncrement(columns => columns.lightbulbStateId)
    /**
     * This candidate key is important.
     * It prevents us from logging two, or more, changes to
     * the same lightbulb at the same time.
     */
    .addCandidateKey(columns => [
        columns.lightbulbId,
        columns.loggedAt,
    ]);
```

-----

### Setting Up the `Log` Class

The `Log` class implements our log design pattern helper.

To get an instance of `Log`, we use a **builder**.
A fully set up `Log` instance looks like this,
```ts
import * as tsql from "@tsql/tsql";

/**
 * This is an instance of the `Log` class.
 */
const lightbulbStateLog = tsql
    /**
     * This gives us a builder for our `Log` class.
     *
     * Takes the `logTable` as an argument.
     */
    .log(lightbulbState)
    /**
     * We need to know what entity the data is describing.
     *
     * Takes the `ownerTable` as an argument.
     *
     * + The `logTable` must have a foreign key to the `ownerTable`'s primary key.
     * + The foreign key columns must have the same column names as the `ownerTable`'s primary key.
     *
     * In this case, our `ownerTable`'s primary key is `(lightbulbId)`,
     * and we have the foreign key,
     * `(lightbulbId, householdId) REFERENCES lightbulb(lightbulbId, householdId)`
     */
    .setOwner(lightbulb)
    /**
     * We need to know how to sort our result set,
     * bringing the latest rows to the top,
     * and earliest rows to the bottom.
     *
     * In this case, our `latestOrder` is `loggedAt DESC`
     *
     * -----
     *
     * Takes a callback that returns the `latestOrder` as an argument.
     *
     * + The `latestOrder` is an `[IColumn, SortDirection]` tuple.
     * + The `latestOrder` sorts rows of the `logTable` from latest to earliest.
     * + This `latestOrder` column represents the "timestamp" that the change in value occurred at.
     *
     * -----
     *
     * The primary key of the `ownerTable` and `latestOrder` column must
     * form a candidate key of the `logTable`.
     *
     * In this example,
     * `(lightbulbId, loggedAt)` must be a candidate key of `lightbulbState`.
     *
     * This is so we **do not** log two, or more, changes to a lightbulb **at the same time**.
     *
     * -----
     *
     * The `latestOrder` column of the `logTable` must have an explicit `DEFAULT` value
     * (or be a `GENERATED` column).
     *
     * For example, `CURRENT_TIMESTAMP(0/1/2/3)`.
     *
     * You don't necessarily have to use the `DATETIME` data type for your `latestOrder` column,
     * but it's probably the most common use case.
     */
    .setLatestOrder(columns => columns.loggedAt.desc())
    /**
     * The set of columns we are tracking over time.
     *
     * -----
     *
     * If we try to log a change to a lightbulb with `switchedOn : true`,
     * two things can happen,
     * + The lightbulb's current `switchedOn` value is `true`.
     *
     *   In this case, no new row is added to the `logTable`
     *   because no change is detected amongst the tracked columns.
     *
     * + The lightbulb's current `switchedOn` value is `false`.
     *
     *   In this case, a new row is added to the `logTable`
     *   because a change is detected amongst the tracked columns.
     */
    .setTracked(columns => [
        columns.switchedOn,
    ])
    /**
     * For columns we do not track, they can be,
     * + A `doNotCopy` column
     * + A `copy` column
     *
     * A `doNotCopy` column is typically used for columns
     * that tell us "who" or "what" caused the data to change.
     *
     * In this case, the `occupantId` tells us "who" caused the data to change.
     *
     * -----
     *
     * 1. Lightbulb #1 is initially switched off
     * 2. John tries to switch it on.
     *
     *    The lightbulb is initially switched off.
     *    So, `(#1, true, John)` is added to the table,
     *    since a change in tracked columns was detected.
     *
     * 3. Mary tries to switch it on.
     *
     *    However, it is already switched on.
     *    So, `(#1, true, Mary)` is ignored and not added to the table,
     *    since no change in tracked columns was detected.
     *
     * 4. Mary tries to switch it off.
     *
     *    The lightbulb was switched on.
     *    So, now `(#1, false, Mary)` is added to the table,
     *    since a change in tracked columns was detected.
     *
     * -----
     *
     * In general, only tracked columns participate in the "change detection".
     */
    .setDoNotCopy(columns => [
        columns.occupantId,
    ])
    /**
     * All remaining columns are `copy` columns.
     *
     * A `copy` column is typically used for columns
     * that participate in a foreign key constraint referencing the `ownerTable`,
     * whose values never change.
     *
     * In this case, the `householdId` is part of the `(lightbulbId, householdId)` foreign key
     * referencing the `lighbulb` table.
     *
     * -----
     *
     * When a row is added to the `logTable`, describing an `ownerTable` for the first time,
     * we need to know what values to use for the `copy` columns.
     *
     * This callback function is used to determine the initial value of `copy` columns.
     *
     * -----
     *
     * When subsequent rows are added, the value of `copy` columns is copied over to the new rows.
     */
    .setCopyDefaults(({ownerPrimaryKey, connection}) : Promise<{ householdId : bigint }> => {
        return lightbulb.fetchOneByPrimaryKey(
            connection,
            ownerPrimaryKey,
            columns => [columns.householdId]
        );
    })
    /**
     * Contains the default value of all tracked columns.
     *
     * This is different from the `DEFAULT` modifier of a column in DDL.
     *
     * -----
     *
     * In this case, if a `lightbulb` has no `lightbulbState` rows recorded,
     * we assume the `lightbulb` is switched off by default.
     */
    .setTrackedDefaults({
        switchedOn : false,
    });
```

-----

### Set Up Explanation

Setting up an instance of the `Log` class always takes 6-7 steps,
and the methods are always called in the same order.

This monotonous, but predictable, piece of boilerplate will
give us access to more complex queries and logging methods.

-----

1. `log(logTable)`

   We need to know where to find the time-series data.

1. `setOwner(ownerTable)`

   We need to know what entity we are describing.

1. `setLatestOrder()`

   Given an entity, we need to know which row was most recently inserted.

1. `setTracked()`

   You must always have at least one `tracked` column.

   These columns are used for "change detection".
   If no change is detected, then no new rows are added to the `logTable`.

1. `setDoNotCopy()`

   It is possible for there to be no `doNotCopy` columns.
   If so, just set it to an empty array.

1. `setCopyDefaults()`

   If there are no `copy` columns, then calling this method is not required.
   (You won't be able to call it, in fact.)

1. `setTrackedDefaults()`

   This is always the last method you call,
   which completes the instantiation of the `Log` class.

-----

### `log(logTable)`

This function instantiates a **builder** that we will use
to create an instance of the `Log` class.

-----

This function takes the `logTable` as an argument.

The `logTable` contains the time-series data.

It tracks the values of attributes over time.

-----

### `setOwner(ownerTable)`

We need to know what entity the data is describing.

-----

This function takes the `ownerTable` as an argument.

+ The `logTable` must have a foreign key to the `ownerTable`'s primary key.
+ The foreign key columns must have the same column names as the `ownerTable`'s primary key.

-----

### `setLatestOrder(latestOrderDelegate)`

Given an entity, we need to know which row was most recently inserted.

We need to know how to sort our result set,
bringing the latest rows to the top,
and earliest rows to the bottom.

-----

Takes a callback that returns the `latestOrder`.

+ The `latestOrder` is an `[IColumn, SortDirection]` tuple.
+ The `latestOrder` sorts rows of the `logTable` from latest to earliest.
+ This `latestOrder` column represents the "timestamp" that the change in value occurred at.

-----

The primary key of the `ownerTable` and `latestOrder` column must
form a candidate key of the `logTable`.

This is so we **do not** log two, or more, changes to a lightbulb **at the same time**.

-----

The `latestOrder` column of the `logTable` must have an explicit `DEFAULT` value
(or be a `GENERATED` column).

For example, `CURRENT_TIMESTAMP(0/1/2/3)`.

You don't necessarily have to use the `DATETIME` data type for your `latestOrder` column,
but it's probably the most common use case.

-----

### `setTracked(trackedDelegate)`

We need to know what set of columns we are tracking over time.

-----

Takes a callback that returns the `tracked` columns.

-----

You must always have at least one `tracked` column.

These columns are used for "change detection".

When attempting to insert new rows using the `Log` class,
if no change is detected, then no new rows are added to the `logTable`.

-----

### `setDoNotCopy(doNotCopyDelegate)`

For columns we do not track, they can be,
+ A `doNotCopy` column
+ A `copy` column

A `doNotCopy` column is typically used for columns
that tell us "who" or "what" caused the data to change.

-----

Takes a callback that returns the `doNotCopy` columns.

-----

It is possible for there to be no `doNotCopy` columns.
If so, just set it to an empty array.

-----

### `setCopyDefaults(copyDefaultsDelegate)`

All remaining columns are `copy` columns.

A `copy` column is typically used for columns
that participate in a foreign key constraint referencing the `ownerTable`,
whose values never change.

-----

Takes a callback. This callback **SHOULD** be deterministic.
Calling it multiple times for the same entity should always yield the same result.

If there are no `copy` columns, then calling this method is not required.
(You won't be able to call it, in fact.)

-----

When a row is added to the `logTable`, describing an `ownerTable` for the first time,
we need to know what values to use for the `copy` columns.

This callback function is used to determine the initial value of `copy` columns.

When subsequent rows are added, the value of `copy` columns is copied over to the new rows.

-----

### `setTrackedDefaults(trackedDefaults)`

This is always the last method you call,
which completes the instantiation of the `Log` class.

Contains the default value of all tracked columns.

This is different from the `DEFAULT` modifier of a column in DDL.

-----

When an entity has no rows in the `logTable`,
we usually still need to know what the "starting state" of the entity is.

The `trackedDefaults` object contains the "starting state" of these entities.
These expressions/values **SHOULD** be deterministic.
Given an entity, evaluating these expressions/values should always yield the same result.

-----

For some `tracked` columns, it does not make sense to have a default value.
For these columns, we can use `undefined` (not `NULL`) as the default value.

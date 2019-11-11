import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";


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

/**
 * This is an instance of the `Log` class.
 */
export const lightbulbStateLog = tsql
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

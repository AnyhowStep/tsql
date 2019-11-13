import * as tm from "type-mapping";
import {ILog} from "../../log";
import {IsolableInsertOneConnection, ExecutionUtil} from "../../../execution";
import {PrimaryKey_Input} from "../../../primary-key";
import {TableUtil} from "../../../table";
import {RawExprNoUsedRef} from "../../../raw-expr";
import {fetchLatestOrDefault} from "./fetch-latest-or-default";
import {DefaultRow} from "./fetch-default";
import {escapeIdentifierWithDoubleQuotes} from "../../../sqlstring";
import {PrimitiveExprUtil} from "../../../primitive-expr";
import {Row} from "../../../row";
import {TrackResult} from "./track-result";

export type TrackRow<LogT extends ILog> =
    /**
     * All `trackedWithDefaultValue` columns may have values set or unset.
     * If unset, previous values are used, if any.
     * Otherwise, default values are used.
     *
     * If set, the set value is used.
     */
    & {
        readonly [columnAlias in LogT["trackedWithDefaultValue"][number]]? : (
            RawExprNoUsedRef<TableUtil.ColumnType<LogT["logTable"], columnAlias>>
        )
    }
    /**
     * All `tracked` columns without default values **should** always have values set.
     * However, with `unsafeTrack()`, we explicitly allow an avoidable run-time error
     * to happen.
     *
     * If set to `undefined`, there's a chance the function will throw.
     *
     * At the moment, these properties are **NOT** optional.
     * You **MUST** explicitly say you want the property to be `undefined`,
     * and explicitly acknowledge the possibility of a run-time error.
     *
     * @todo Maybe consider making the property optional?
     */
    & {
        readonly [columnAlias in Exclude<
            LogT["tracked"][number],
            LogT["trackedWithDefaultValue"][number]
        >] : (
            | undefined
            | RawExprNoUsedRef<TableUtil.ColumnType<LogT["logTable"], columnAlias>>
        )
    }
    /**
     * All required `doNotCopy` columns must have values set.
     */
    & {
        readonly [columnAlias in Extract<
            LogT["doNotCopy"][number],
            TableUtil.RequiredColumnAlias<LogT["logTable"]>
        >] : (
            RawExprNoUsedRef<TableUtil.ColumnType<LogT["logTable"], columnAlias>>
        )
    }
    /**
     * All optional `doNotCopy` columns may have values set or unset.
     * If unset, the default value is used.
     * If set, the set value is used.
     */
    & {
        readonly [columnAlias in Extract<
            LogT["doNotCopy"][number],
            TableUtil.OptionalColumnAlias<LogT["logTable"]>
        >]? : (
            RawExprNoUsedRef<TableUtil.ColumnType<LogT["logTable"], columnAlias>>
        )
    }
;

function toInsertRow<LogT extends ILog> (
    log : LogT,
    prvRow : DefaultRow<LogT>,
    newRow : TrackRow<LogT>
) {
    const result : any = {};

    /**
     * Copy `prvRow`'s primary key
     */
    for (const primaryKeyColumnAlias of log.ownerTable.primaryKey) {
        result[primaryKeyColumnAlias] = prvRow[primaryKeyColumnAlias as keyof typeof prvRow];
    }
    /**
     * Copy all `tracked` values, if no new value is provided.
     */
    let changed = false;
    for (const trackedColumnAlias of log.tracked) {
        const rawNewValue = newRow[trackedColumnAlias as keyof typeof newRow];
        const prvValue = prvRow[trackedColumnAlias as keyof typeof prvRow];
        if (rawNewValue === undefined) {
            if (prvValue === undefined) {
                throw new Error(`No new or previous value for ${escapeIdentifierWithDoubleQuotes(log.logTable.alias)}.${escapeIdentifierWithDoubleQuotes(trackedColumnAlias)} was found`);
            } else {
                /**
                 * Use the previous value, since we don't have a new value.
                 */
                /**
                 * @todo Fix this, somehow
                 * Copying values from `prvRow` is not safe.
                 *
                 * For example, if `prvRow[copyColumnAlias]` is of type...
                 * `SomeLib.BigDecimal`. Then, we would not know how to convert
                 * that data type to a SQL string.
                 *
                 * This will cause a run-time error.
                 *
                 * -----
                 *
                 * @todo Maybe have a way for adapter libraries to wrap the `log()` builder
                 * and provide a data mapper?
                 * One that can convert `SomeLib.BigDecimal` to an `IExpr`.
                 */
                result[trackedColumnAlias] = prvValue;
            }
        } else {
            const newValue = (
                PrimitiveExprUtil.isPrimitiveExpr(rawNewValue) ?
                log.logTable.columns[trackedColumnAlias].mapper(
                    `${escapeIdentifierWithDoubleQuotes(log.logTable.alias)}.${escapeIdentifierWithDoubleQuotes(trackedColumnAlias)}`,
                    rawNewValue
                ) :
                rawNewValue
            );
            result[trackedColumnAlias] = newValue;
            if (!tm.TypeUtil.strictEqual(newValue, prvValue)) {
                /**
                 * New value is used, we consider this a change.
                 */
                changed = true;
            }
        }
    }
    /**
     * We expect new values for all required `doNotCopy` columns
     */
    for (const doNotCopyColumnAlias of log.doNotCopy) {
        const rawNewValue = newRow[doNotCopyColumnAlias as keyof typeof newRow];
        if (rawNewValue === undefined) {
            if (TableUtil.isRequiredColumnAlias(log.logTable, doNotCopyColumnAlias)) {
                throw new Error(`Expected a new value for ${escapeIdentifierWithDoubleQuotes(log.logTable.alias)}.${escapeIdentifierWithDoubleQuotes(doNotCopyColumnAlias)}`);
            } else {
                continue;
            }
        }
        const newValue = (
            PrimitiveExprUtil.isPrimitiveExpr(rawNewValue) ?
            log.logTable.columns[doNotCopyColumnAlias].mapper(
                `${escapeIdentifierWithDoubleQuotes(log.logTable.alias)}.${escapeIdentifierWithDoubleQuotes(doNotCopyColumnAlias)}`,
                rawNewValue
            ) :
            rawNewValue
        );
        result[doNotCopyColumnAlias] = newValue;
    }
    /**
     * Copy the previous row's `copy`
     */
    for (const copyColumnAlias of log.copy) {
        /**
         * @todo Fix this, somehow
         * Copying values from `prvRow` is not safe.
         *
         * For example, if `prvRow[copyColumnAlias]` is of type...
         * `SomeLib.BigDecimal`. Then, we would not know how to convert
         * that data type to a SQL string.
         *
         * This will cause a run-time error.
         *
         * -----
         *
         * @todo Maybe have a way for adapter libraries to wrap the `log()` builder
         * and provide a data mapper?
         * One that can convert `SomeLib.BigDecimal` to an `IExpr`.
         */
        result[copyColumnAlias] = prvRow[copyColumnAlias as keyof typeof prvRow];
    }

    return {
        changed,
        insertRow : result,
    };
}

export type Track<LogT extends ILog> =
    TrackResult<
        Row<LogT["logTable"]>,
        DefaultRow<LogT>
    >
;

/**
 * Allows `tracked` columns without default values to be unset.
 * However, this comes with the risk of run-time errors, if no previous row is found.
 */
export async function unsafeTrack<LogT extends ILog> (
    log : LogT,
    connection : IsolableInsertOneConnection,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>,
    unsafeTrackRow : TrackRow<LogT>
) : (
    Promise<Track<LogT>>
) {
    return connection.transactionIfNotInOne(async (connection) : Promise<Track<LogT>> => {
        const latestOrDefault = await fetchLatestOrDefault(log, connection, primaryKey);
        const {changed, insertRow} = toInsertRow(
            log,
            latestOrDefault.row as DefaultRow<LogT>,
            unsafeTrackRow
        );
        if (changed) {
            return {
                changed,
                previous : latestOrDefault,
                current : await ExecutionUtil.insertAndFetch(
                    log.logTable as any,
                    connection,
                    insertRow
                ) as Row<LogT["logTable"]>,
            };
        } else {
            return {
                changed,
                previous : latestOrDefault,
            };
        }
    });
}

import * as tm from "type-mapping";
import {ILog} from "../../../log";
import {IsolableInsertOneConnection, ExecutionUtil} from "../../../../execution";
import {PrimaryKey_Input} from "../../../../primary-key";
import {TableUtil} from "../../../../table";
import {RawExprNoUsedRef} from "../../../../raw-expr";
import {fetchLatestOrDefault, LatestOrDefault} from "./fetch-latest-or-default";
import {DefaultRow} from "./fetch-default";
import {escapeIdentifierWithDoubleQuotes} from "../../../../sqlstring";
import {PrimitiveExprUtil} from "../../../../primitive-expr";
import {Row} from "../../../../row";

export type TrackOrInsertRow<LogT extends ILog> =
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
     * All `tracked` columns without default values must always have values set.
     */
    & {
        readonly [columnAlias in Exclude<
            LogT["tracked"][number],
            LogT["trackedWithDefaultValue"][number]
        >] : (
            RawExprNoUsedRef<TableUtil.ColumnType<LogT["logTable"], columnAlias>>
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
    newRow : TrackOrInsertRow<LogT>
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
        result[copyColumnAlias] = prvRow[copyColumnAlias as keyof typeof prvRow];
    }

    return {
        changed,
        insertRow : result,
    };
}

export type TrackOrInsertResult<LatestRowT, DefaultRowT> =
    | {
        changed : true,
        previous : LatestOrDefault<LatestRowT, DefaultRowT>,
        current : LatestRowT,
    }
    | {
        changed : false,
        previous : LatestOrDefault<LatestRowT, DefaultRowT>,
    }
;

export type TrackOrInsert<LogT extends ILog> =
    TrackOrInsertResult<
        Row<LogT["logTable"]>,
        DefaultRow<LogT>
    >
;

export async function trackOrInsert<LogT extends ILog> (
    log : LogT,
    connection : IsolableInsertOneConnection,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>,
    trackOrInsertRow : TrackOrInsertRow<LogT>
) : (
    Promise<TrackOrInsert<LogT>>
) {
    return connection.transactionIfNotInOne(async (connection) : Promise<TrackOrInsert<LogT>> => {
        const latestOrDefault = await fetchLatestOrDefault(log, connection, primaryKey);
        const {changed, insertRow} = toInsertRow(
            log,
            latestOrDefault.row as DefaultRow<LogT>,
            trackOrInsertRow
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

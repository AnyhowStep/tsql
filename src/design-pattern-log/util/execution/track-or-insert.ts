import {ILog} from "../../log";
import {IsolableInsertOneConnection} from "../../../execution";
import {PrimaryKey_Input} from "../../../primary-key";
import {TableUtil} from "../../../table";
import {RawExprNoUsedRef_Input} from "../../../raw-expr";
import {Track, unsafeTrack} from "./unsafe-track";

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
            RawExprNoUsedRef_Input<TableUtil.ColumnType<LogT["logTable"], columnAlias>>
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
            RawExprNoUsedRef_Input<TableUtil.ColumnType<LogT["logTable"], columnAlias>>
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
            RawExprNoUsedRef_Input<TableUtil.ColumnType<LogT["logTable"], columnAlias>>
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
            RawExprNoUsedRef_Input<TableUtil.ColumnType<LogT["logTable"], columnAlias>>
        )
    }
;

export async function trackOrInsert<LogT extends ILog> (
    log : LogT,
    connection : IsolableInsertOneConnection,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>,
    trackOrInsertRow : TrackOrInsertRow<LogT>
) : (
    Promise<Track<LogT>>
) {
    return unsafeTrack(log, connection, primaryKey, trackOrInsertRow);
}

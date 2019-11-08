import {TableWithPrimaryKey, InsertableTable} from "../table";
import {IColumn} from "../column";
import {SortDirection} from "../sort-direction";
import {IsolableSelectConnection} from "../execution";

/**
 * Properties ordered this way to look nicest when type is emitted/displayed.
 */
export interface LogData {
    readonly tracked : readonly string[],
    readonly doNotCopy : readonly string[],
    readonly copy : readonly string[],
    readonly trackedWithDefaultValue : readonly string[],

    readonly logTable : InsertableTable,
    readonly ownerTable : TableWithPrimaryKey,
}

export interface ILog<DataT extends LogData=LogData> {
    readonly tracked : DataT["tracked"],
    readonly doNotCopy : DataT["doNotCopy"],
    readonly copy : DataT["copy"],
    readonly trackedWithDefaultValue : DataT["trackedWithDefaultValue"],

    readonly logTable : DataT["logTable"],
    readonly ownerTable : DataT["ownerTable"],

    /**
     * (`ownerTable`'s PK, `IColumn`) must form a
     * candidate key of `logTable`
     */
    readonly latestOrder : readonly [IColumn, SortDirection],

    /**
     * May have `ownerTable` as `IUsedRef`
     */
    readonly copyDefaultsDelegate : (args : {
        ownerPrimaryKey : unknown,
        connection : IsolableSelectConnection
    }) => Promise<unknown>,

    /**
     * May have `ownerTable` as `IUsedRef`
     */
    readonly trackedDefaults : { [columnAlias : string] : unknown },
}

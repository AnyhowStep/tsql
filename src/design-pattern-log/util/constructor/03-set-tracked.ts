import {Identity} from "../../../type-util";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {LogData, ILog} from "../../log";
import {ColumnMapUtil} from "../../../column-map";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";
import {LogMustSetDoNotCopy} from "./04-set-do-not-copy";

export type LogMustSetTrackedData =
    & Pick<
        LogData,
        | "logTable"
        | "ownerTable"
    >
    & Pick<
        ILog,
        | "newestOrder"
    >
;

export type TrackedColumnMap<
    DataT extends LogMustSetTrackedData
> =
    Identity<{
        [columnAlias in Exclude<
            Extract<keyof DataT["logTable"]["columns"], string>,
            | DataT["ownerTable"]["primaryKey"][number]
            | DataT["logTable"]["generatedColumns"][number]
            | DataT["logTable"]["autoIncrement"]
            | DataT["newestOrder"][0]["columnAlias"]
        >] : (
            DataT["logTable"]["columns"][columnAlias]
        )
    }>
;
export type Tracked<
    DataT extends LogMustSetTrackedData
> =
    readonly [
        ColumnUtil.FromColumnMap<
            TrackedColumnMap<DataT>
        >,
        ...ColumnUtil.FromColumnMap<
            TrackedColumnMap<DataT>
        >[]
    ]
;
export type TrackedDelegate<
    DataT extends LogMustSetTrackedData,
    TrackedT extends Tracked<DataT>
> =
    (
        columns : TrackedColumnMap<DataT>
    ) => TrackedT
;

export class LogMustSetTracked<DataT extends LogMustSetTrackedData> {
    readonly logTable : DataT["logTable"];
    readonly ownerTable : DataT["ownerTable"];
    readonly newestOrder : DataT["newestOrder"];

    constructor (data : DataT) {
        this.logTable = data.logTable;
        this.ownerTable = data.ownerTable;
        this.newestOrder = data.newestOrder;
    }

    setTracked<
        TrackedT extends Tracked<DataT>
    >(
        trackedDelegate : TrackedDelegate<DataT, TrackedT>
    ) : (
        LogMustSetDoNotCopy<{
            logTable : DataT["logTable"],
            ownerTable : DataT["ownerTable"],
            newestOrder : DataT["newestOrder"],
            tracked : readonly (TrackedT[number]["columnAlias"])[],
            copy : readonly (
                Exclude<
                    Extract<keyof DataT["logTable"]["columns"], string>,
                    | DataT["ownerTable"]["primaryKey"][number]
                    | DataT["logTable"]["generatedColumns"][number]
                    | DataT["logTable"]["autoIncrement"]
                    | DataT["newestOrder"][0]["columnAlias"]
                    | TrackedT[number]["columnAlias"]
                >
            )[],
        }>
    ) {
        const trackedColumns = ColumnMapUtil.omit(
            this.logTable.columns,
            [
                ...this.ownerTable.primaryKey,
                ...this.logTable.generatedColumns,
                this.newestOrder[0].columnAlias,
            ]
        );
        const tracked = trackedDelegate(trackedColumns as any);
        ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
            trackedColumns,
            tracked
        );

        const invalidCopy = [
            ...this.ownerTable.primaryKey,
            ...this.logTable.generatedColumns,
            ...(
                this.logTable.autoIncrement == undefined ?
                [] :
                [this.logTable.autoIncrement]
            ),
            this.newestOrder[0].columnAlias,
            ...tracked.map(column => column.columnAlias),
        ];
        const copy = ColumnArrayUtil.fromColumnMap(this.logTable.columns)
            .map(column => column.columnAlias)
            .filter(columnAlias => {
                return !invalidCopy.includes(columnAlias);
            });

        return new LogMustSetDoNotCopy<{
            logTable : DataT["logTable"],
            ownerTable : DataT["ownerTable"],
            newestOrder : DataT["newestOrder"],
            tracked : readonly (TrackedT[number]["columnAlias"])[],
            copy : readonly (
                Exclude<
                    Extract<keyof DataT["logTable"]["columns"], string>,
                    | DataT["ownerTable"]["primaryKey"][number]
                    | DataT["logTable"]["generatedColumns"][number]
                    | DataT["logTable"]["autoIncrement"]
                    | DataT["newestOrder"][0]["columnAlias"]
                    | TrackedT[number]["columnAlias"]
                >
            )[],
        }>({
            logTable : this.logTable,
            ownerTable : this.ownerTable,
            newestOrder : this.newestOrder,
            tracked : tracked.map(column => column.columnAlias),
            copy : copy as any,
        });
    }
}

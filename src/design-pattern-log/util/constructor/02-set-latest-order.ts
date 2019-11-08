import {KeyArrayUtil} from "../../../key";
import {Identity} from "../../../type-util";
import {ColumnUtil} from "../../../column";
import {SortDirection} from "../../../sort-direction";
import {ColumnMapUtil} from "../../../column-map";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";
import {LogData} from "../../log";
import {LogMustSetTracked} from "./03-set-tracked";

export type LogMustSetLatestOrderData = Pick<
    LogData,
    | "logTable"
    | "ownerTable"
>;

export type LatestOrderColumnAlias<
    DataT extends LogMustSetLatestOrderData
> =
    {
        [columnAlias in (
            | DataT["ownerTable"]["primaryKey"][number]
            | DataT["logTable"]["explicitDefaultValueColumns"][number]
            | DataT["logTable"]["generatedColumns"][number]
        )] : (
            KeyArrayUtil.HasKey<
            DataT["logTable"]["candidateKeys"],
                readonly (
                    | DataT["ownerTable"]["primaryKey"][number]
                    | columnAlias
                )[]
            > extends true ?
            columnAlias :
            never
        )
    }[
        | DataT["ownerTable"]["primaryKey"][number]
        | DataT["logTable"]["explicitDefaultValueColumns"][number]
        | DataT["logTable"]["generatedColumns"][number]
    ]
;
export function latestOrderColumnAlias<
    DataT extends LogMustSetLatestOrderData
> (
    data : DataT
) : (
    LatestOrderColumnAlias<DataT>[]
) {
    const {logTable, ownerTable} = data;
    const possibleColumnAliases = [
        ...ownerTable.primaryKey,
        ...logTable.explicitDefaultValueColumns,
        ...logTable.generatedColumns,
    ];
    const result = possibleColumnAliases.filter(columnAlias => KeyArrayUtil.hasKey(
        logTable.candidateKeys,
        [...ownerTable.primaryKey, columnAlias]
    ));

    return result as LatestOrderColumnAlias<DataT>[];
}
export type LatestOrderColumnMap<
    DataT extends LogMustSetLatestOrderData
> =
    Identity<{
        [columnAlias in LatestOrderColumnAlias<DataT>] : (
            DataT["logTable"]["columns"][columnAlias]
        )
    }>
;
export type LatestOrder<
    DataT extends LogMustSetLatestOrderData
> =
    readonly [
        ColumnUtil.FromColumnMap<
            LatestOrderColumnMap<DataT>
        >,
        SortDirection
    ]
;
export type LatestOrderDelegate<
    DataT extends LogMustSetLatestOrderData,
    LatestOrderT extends LatestOrder<DataT>
> =
    (
        columns : LatestOrderColumnMap<DataT>
    ) => LatestOrderT
;

export class LogMustSetLatestOrder<DataT extends LogMustSetLatestOrderData> {
    readonly logTable : DataT["logTable"];
    readonly ownerTable : DataT["ownerTable"];

    constructor (data : DataT) {
        this.logTable = data.logTable;
        this.ownerTable = data.ownerTable;
    }

    setLatestOrder<
        LatestOrderT extends LatestOrder<DataT>
    >(
        latestOrderDelegate : LatestOrderDelegate<DataT, LatestOrderT>
    ) : (
        LogMustSetTracked<{
            logTable : DataT["logTable"],
            ownerTable : DataT["ownerTable"],
            latestOrder : LatestOrderT,
        }>
    ) {
        const latestOrderColumns = ColumnMapUtil.pick(
            this.logTable.columns,
            latestOrderColumnAlias(
                this
            )
        );
        const latestOrder = latestOrderDelegate(latestOrderColumns as any);
        ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
            latestOrderColumns,
            [latestOrder[0]]
        );

        return new LogMustSetTracked<{
            logTable : DataT["logTable"],
            ownerTable : DataT["ownerTable"],
            latestOrder : LatestOrderT,
        }>({
            logTable : this.logTable,
            ownerTable : this.ownerTable,
            latestOrder,
        });
    }
}

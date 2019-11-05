import {KeyArrayUtil} from "../../../key";
import {Identity} from "../../../type-util";
import {ColumnUtil} from "../../../column";
import {SortDirection} from "../../../sort-direction";
import {ColumnMapUtil} from "../../../column-map";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";
import {LogData} from "../../log";
import {LogMustSetTracked} from "./03-set-tracked";

export type LogMustSetNewestOrderData = Pick<
    LogData,
    | "logTable"
    | "ownerTable"
>;

export type NewestOrderColumnAlias<
    DataT extends LogMustSetNewestOrderData
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
export function newestOrderColumnAlias<
    DataT extends LogMustSetNewestOrderData
> (
    data : DataT
) : (
    NewestOrderColumnAlias<DataT>[]
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

    return result as NewestOrderColumnAlias<DataT>[];
}
export type NewestOrderColumnMap<
    DataT extends LogMustSetNewestOrderData
> =
    Identity<{
        [columnAlias in NewestOrderColumnAlias<DataT>] : (
            DataT["logTable"]["columns"][columnAlias]
        )
    }>
;
export type NewestOrder<
    DataT extends LogMustSetNewestOrderData
> =
    readonly [
        ColumnUtil.FromColumnMap<
            NewestOrderColumnMap<DataT>
        >,
        SortDirection
    ]
;
export type NewestOrderDelegate<
    DataT extends LogMustSetNewestOrderData,
    NewestOrderT extends NewestOrder<DataT>
> =
    (
        columns : NewestOrderColumnMap<DataT>
    ) => NewestOrderT
;

export class LogMustSetNewestOrder<DataT extends LogMustSetNewestOrderData> {
    readonly logTable : DataT["logTable"];
    readonly ownerTable : DataT["ownerTable"];

    constructor (data : DataT) {
        this.logTable = data.logTable;
        this.ownerTable = data.ownerTable;
    }

    setNewestOrder<
        NewestOrderT extends NewestOrder<DataT>
    >(
        newestOrderDelegate : NewestOrderDelegate<DataT, NewestOrderT>
    ) : (
        LogMustSetTracked<{
            logTable : DataT["logTable"],
            ownerTable : DataT["ownerTable"],
            newestOrder : NewestOrderT,
        }>
    ) {
        const newestOrderColumns = ColumnMapUtil.pick(
            this.logTable.columns,
            newestOrderColumnAlias(
                this
            )
        );
        const newestOrder = newestOrderDelegate(newestOrderColumns as any);
        ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
            newestOrderColumns,
            [newestOrder[0]]
        );

        return new LogMustSetTracked<{
            logTable : DataT["logTable"],
            ownerTable : DataT["ownerTable"],
            newestOrder : NewestOrderT,
        }>({
            logTable : this.logTable,
            ownerTable : this.ownerTable,
            newestOrder,
        });
    }
}

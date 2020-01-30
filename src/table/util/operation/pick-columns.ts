import {ITable} from "../../table";
import {AliasedTable} from "../../../aliased-table";
import {ColumnUtil} from "../../../column";
import {ExpandPick, pickOwnEnumerable} from "../../../type-util";

export type PickColumnsDelegate<
    TableT extends Pick<ITable, "columns">,
    NewColumnsT extends readonly ColumnUtil.FromColumnMap<TableT["columns"]>[]
> =
    (columnMap : TableT["columns"]) => NewColumnsT
;

export type PickColumns<
    TableT extends ITable,
    NewColumnsT extends readonly ColumnUtil.FromColumnMap<TableT["columns"]>[]
> = (
    AliasedTable<{
        isLateral : TableT["isLateral"],
        alias : TableT["alias"],
        columns : ExpandPick<TableT["columns"], NewColumnsT[number]["columnAlias"]>,
        usedRef : TableT["usedRef"],
    }>
);

export function pickColumns<
    TableT extends ITable,
    NewColumnsT extends readonly ColumnUtil.FromColumnMap<TableT["columns"]>[]
> (
    table : TableT,
    delegate : (
        PickColumnsDelegate<
            TableT,
            NewColumnsT
        >
    )
) : (
    PickColumns<TableT, NewColumnsT>
) {
    const newColumns : NewColumnsT = delegate(table.columns);

    const {
        isLateral,
        alias,
        columns,
        usedRef,
    } = table;

    const result : PickColumns<TableT, NewColumnsT> = new AliasedTable(
        {
            isLateral,
            alias,
            columns : pickOwnEnumerable(
                columns,
                newColumns.map(column => column.columnAlias)
            ) as ExpandPick<TableT["columns"], NewColumnsT[number]["columnAlias"]>,
            usedRef,
        },
        table.unaliasedAst
    );
    return result;
}

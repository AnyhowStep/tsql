import {ITable} from "../../table";
import {AliasedTable} from "../../../aliased-table";
import {ColumnMapUtil} from "../../../column-map";

export type As<TableT extends ITable, NewTableAliasT extends string> = (
    AliasedTable<{
        lateral : TableT["lateral"],
        tableAlias : NewTableAliasT;
        columns : ColumnMapUtil.WithTableAlias<
            TableT["columns"],
            NewTableAliasT
        >;
        usedRef : TableT["usedRef"];
    }>
);
export function as<TableT extends ITable, NewTableAliasT extends string> (
    {
        lateral,
        columns,
        usedRef,
        unaliasedAst,
    } : TableT,
    newTableAlias : NewTableAliasT
) : (
    As<TableT, NewTableAliasT>
) {
    //https://github.com/Microsoft/TypeScript/issues/28592
    const columnsGeneric : TableT["columns"] = columns;
    return new AliasedTable(
        {
            lateral,
            tableAlias : newTableAlias,
            columns : ColumnMapUtil.withTableAlias(
                columnsGeneric,
                newTableAlias
            ),
            usedRef : usedRef,
        },
        unaliasedAst
    );
}
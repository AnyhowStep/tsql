import {escapeIdentifier} from "../../../sqlstring";
import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnMapUtil} from "../../../column-map";

export type SetTableAlias<TableT extends ITable, NewTableAliasT extends string> = (
    Table<{
        lateral : TableT["lateral"],
        tableAlias : NewTableAliasT,
        columns : ColumnMapUtil.WithTableAlias<
            TableT["columns"],
            NewTableAliasT
        >,
        usedRef : TableT["usedRef"],

        autoIncrement : TableT["autoIncrement"],
        id : TableT["id"],
        primaryKey : TableT["primaryKey"],
        candidateKeys : TableT["candidateKeys"],

        insertEnabled : TableT["insertEnabled"],
        deleteEnabled : TableT["deleteEnabled"],

        generatedColumns : TableT["generatedColumns"],
        nullableColumns : TableT["nullableColumns"],
        explicitDefaultValueColumns : TableT["explicitDefaultValueColumns"],
        mutableColumns : TableT["mutableColumns"],

        parents : TableT["parents"],
    }>
);
/**
 * Overwrites `.setDatabaseName()`
 *
 * @param table
 * @param newTableAlias
 */
export function setTableAlias<TableT extends ITable, NewTableAliasT extends string> (
    table : TableT,
    newTableAlias : NewTableAliasT
) : (
    SetTableAlias<TableT, NewTableAliasT>
) {
    //https://github.com/Microsoft/TypeScript/issues/28592
    const columns : TableT["columns"] = table.columns;

    const {
        lateral,
        //tableAlias,
        //columns,
        usedRef,

        autoIncrement,
        id,
        primaryKey,
        candidateKeys,

        insertEnabled,
        deleteEnabled,

        generatedColumns,
        nullableColumns,
        explicitDefaultValueColumns,
        mutableColumns,

        parents,
    } = table;

    return new Table(
        {
            lateral,
            tableAlias : newTableAlias,
            columns : ColumnMapUtil.withTableAlias<TableT["columns"], NewTableAliasT>(
                columns,
                newTableAlias
            ),
            usedRef,

            autoIncrement,
            id,
            primaryKey,
            candidateKeys,

            insertEnabled,
            deleteEnabled,

            generatedColumns,
            nullableColumns,
            explicitDefaultValueColumns,
            mutableColumns,

            parents,
        },
        escapeIdentifier(newTableAlias)
    );
}

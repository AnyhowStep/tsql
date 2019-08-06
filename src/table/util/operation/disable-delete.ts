import {ITable} from "../../table";
import {Table} from "../../table-impl";

/**
 * @todo Add `EnableDelete`? Will it even ever see use?
 */
export type DisableDelete<
    TableT extends ITable
> = (
    Table<{
        isLateral : TableT["isLateral"],
        tableAlias : TableT["tableAlias"],
        columns : TableT["columns"],
        usedRef : TableT["usedRef"],

        autoIncrement : TableT["autoIncrement"],
        id : TableT["id"],
        primaryKey : TableT["primaryKey"],
        candidateKeys : TableT["candidateKeys"],

        insertEnabled : TableT["insertEnabled"],
        deleteEnabled : false,

        generatedColumns : TableT["generatedColumns"],
        nullableColumns : TableT["nullableColumns"],
        explicitDefaultValueColumns : TableT["explicitDefaultValueColumns"],
        mutableColumns : TableT["mutableColumns"],

        parents : TableT["parents"],
    }>
);
/**
 * Prevents rows of this table from being deleted through this library.
 *
 * Good for look-up tables, or append-only tables.
 *
 * @param table
 */
export function disableDelete<
    TableT extends ITable
> (
    table : TableT
) : (
    DisableDelete<TableT>
) {
    const {
        isLateral: isLateral,
        tableAlias,
        columns,
        usedRef,

        autoIncrement,
        id,
        primaryKey,
        candidateKeys,

        insertEnabled,
        //deleteEnabled,

        generatedColumns,
        nullableColumns,
        explicitDefaultValueColumns,
        mutableColumns,

        parents,
    } = table;


    const result : DisableDelete<TableT> = new Table(
        {
            isLateral,
            tableAlias,
            columns,
            usedRef,

            autoIncrement,
            id,
            primaryKey,
            candidateKeys,

            insertEnabled,
            deleteEnabled : false,

            generatedColumns,
            nullableColumns,
            explicitDefaultValueColumns,
            mutableColumns,

            parents,
        },
        table.unaliasedAst
    );
    return result;
}

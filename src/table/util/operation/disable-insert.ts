import {ITable} from "../../table";
import {Table} from "../../table-impl";

/**
 * @todo Add `EnableInsert`? Will it even ever see use?
 */
export type DisableInsert<
    TableT extends ITable
> = (
    Table<{
        isLateral : TableT["isLateral"],
        alias : TableT["alias"],
        columns : TableT["columns"],
        usedRef : TableT["usedRef"],

        autoIncrement : TableT["autoIncrement"],
        id : TableT["id"],
        primaryKey : TableT["primaryKey"],
        candidateKeys : TableT["candidateKeys"],

        insertEnabled : false,
        deleteEnabled : TableT["deleteEnabled"],

        generatedColumns : TableT["generatedColumns"],
        nullableColumns : TableT["nullableColumns"],
        explicitDefaultValueColumns : TableT["explicitDefaultValueColumns"],
        mutableColumns : TableT["mutableColumns"],

        explicitAutoIncrementValueEnabled : TableT["explicitAutoIncrementValueEnabled"],
    }>
);
/**
 * Prevents rows from being inserted through this library.
 *
 * Good for look-up tables.
 *
 * @param table
 */
export function disableInsert<
    TableT extends ITable
> (
    table : TableT
) : (
    DisableInsert<TableT>
) {
    const {
        isLateral,
        alias,
        columns,
        usedRef,

        autoIncrement,
        id,
        primaryKey,
        candidateKeys,

        //insertEnabled,
        deleteEnabled,

        generatedColumns,
        nullableColumns,
        explicitDefaultValueColumns,
        mutableColumns,

        explicitAutoIncrementValueEnabled,
    } = table;


    const result : DisableInsert<TableT> = new Table(
        {
            isLateral,
            alias,
            columns,
            usedRef,

            autoIncrement,
            id,
            primaryKey,
            candidateKeys,

            insertEnabled : false,
            deleteEnabled,

            generatedColumns,
            nullableColumns,
            explicitDefaultValueColumns,
            mutableColumns,

            explicitAutoIncrementValueEnabled,
        },
        table.unaliasedAst
    );
    return result;
}

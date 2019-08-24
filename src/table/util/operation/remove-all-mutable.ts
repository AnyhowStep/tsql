import {ITable} from "../../table";
import {Table} from "../../table-impl";

export type RemoveAllMutable<
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

        insertEnabled : TableT["insertEnabled"],
        deleteEnabled : TableT["deleteEnabled"],

        generatedColumns : TableT["generatedColumns"],
        nullableColumns : TableT["nullableColumns"],
        explicitDefaultValueColumns : TableT["explicitDefaultValueColumns"],
        /**
         * No columns are mutable
         */
        mutableColumns : readonly [],
    }>
);
/**
 * Makes all columns immutable.
 *
 * @param table
 */
export function removeAllMutable<
    TableT extends ITable
> (
    table : TableT
) : (
    RemoveAllMutable<TableT>
) {
    const mutableColumns : readonly [] = [];

    const {
        isLateral,
        alias,
        columns,
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
        //mutableColumns,
    } = table;


    const result : RemoveAllMutable<TableT> = new Table(
        {
            isLateral,
            alias,
            columns,
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
        },
        table.unaliasedAst
    );
    return result;
}

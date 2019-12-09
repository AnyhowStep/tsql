import {ITable} from "../../table";
import {Table} from "../../table-impl";

export type EnableExplicitAutoIncrementValue<
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
        mutableColumns : TableT["mutableColumns"],

        explicitAutoIncrementValueEnabled : true,
    }>
);

/**
 * Allows explicit values for auto-increment columns.
 */
export function enableExplicitAutoIncrementValue<
    TableT extends ITable
> (
    table : TableT
) : (
    EnableExplicitAutoIncrementValue<TableT>
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

        insertEnabled,
        deleteEnabled,

        generatedColumns,
        nullableColumns,
        explicitDefaultValueColumns,
        mutableColumns,

        //explicitAutoIncrementValueEnabled,
    } = table;


    const result : EnableExplicitAutoIncrementValue<TableT> = new Table(
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

            explicitAutoIncrementValueEnabled : true,
        },
        table.unaliasedAst
    );
    return result;
}

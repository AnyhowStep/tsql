import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {identifierNode, isIdentifierNode} from "../../../ast";

export type SetSchemaName<TableT extends ITable> = (
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

        explicitAutoIncrementValueEnabled : TableT["explicitAutoIncrementValueEnabled"],
    }>
);
/**
 * Sets the `schema` that this table belongs to.
 *
 * This is usually not required because the schema used
 * will be the one your database connection session is using.
 *
 * -----
 *
 * This library does not support cross-schema compile-time safe queries.
 *
 * However, if you **do** need cross-schema support,
 * this library can support it somewhat.
 *
 * -----
 *
 * @param table
 * @param newSchemaName
 */
export function setSchemaName<TableT extends ITable> (
    table : TableT,
    newSchemaName : string
) : (
    SetSchemaName<TableT>
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

        explicitAutoIncrementValueEnabled,
    } = table;

    return new Table(
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

            explicitAutoIncrementValueEnabled,
        },
        (
            isIdentifierNode(table.unaliasedAst) ?
            identifierNode(
                newSchemaName,
                //The table alias on the database
                table.unaliasedAst.identifiers[table.unaliasedAst.identifiers.length-1]
            ) :
            identifierNode(
                newSchemaName,
                alias
            )
        )
    );
}

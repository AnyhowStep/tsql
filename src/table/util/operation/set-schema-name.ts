import {escapeIdentifier} from "../../../sqlstring";
import {ITable} from "../../table";
import {Table} from "../../table-impl";

export type SetSchemaName<TableT extends ITable> = (
    Table<{
        lateral : TableT["lateral"],
        tableAlias : TableT["tableAlias"],
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

        parents : TableT["parents"],
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
        lateral,
        tableAlias,
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

        parents,
    } = table;

    return new Table(
        {
            lateral,
            tableAlias,
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

            parents,
        },
        [
            escapeIdentifier(newSchemaName),
            ".",
            escapeIdentifier(tableAlias),
        ]
    );
}

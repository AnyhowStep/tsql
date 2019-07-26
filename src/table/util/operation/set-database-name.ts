import {escapeIdentifier} from "../../../sqlstring";
import {ITable} from "../../table";
import {Table} from "../../table-impl";

export type SetDatabaseName<TableT extends ITable> = (
    Table<{
        lateral : TableT["lateral"],
        tableAlias : TableT["tableAlias"],
        columns : TableT["columns"],
        usedRef : TableT["usedRef"],

        autoIncrement : TableT["autoIncrement"],
        id : TableT["id"],
        primaryKey : TableT["primaryKey"],
        candidateKeys : TableT["candidateKeys"],

        insertAllowed : TableT["insertAllowed"],
        deleteAllowed : TableT["deleteAllowed"],

        generatedColumns : TableT["generatedColumns"],
        nullableColumns : TableT["nullableColumns"],
        explicitDefaultValueColumns : TableT["explicitDefaultValueColumns"],
        mutableColumns : TableT["mutableColumns"],

        parents : TableT["parents"],
    }>
);
export function setDatabaseName<TableT extends ITable> (
    table : TableT,
    newDatabaseName : string
) : (
    SetDatabaseName<TableT>
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

        insertAllowed,
        deleteAllowed,

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

            insertAllowed,
            deleteAllowed,

            generatedColumns,
            nullableColumns,
            explicitDefaultValueColumns,
            mutableColumns,

            parents,
        },
        [
            escapeIdentifier(newDatabaseName),
            ".",
            escapeIdentifier(tableAlias),
        ]
    );
}

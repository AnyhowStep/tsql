import {escapeIdentifier} from "../../../sqlstring";
import {Table} from "../../table-impl";

export type FromTableAlias<
    TableAliasT extends string
> = (
    Table<{
        lateral : false,
        tableAlias : TableAliasT,
        columns : {},
        usedRef : {},

        autoIncrement : undefined,
        id : undefined,
        primaryKey : undefined,
        candidateKeys : readonly [],

        insertEnabled : true,
        deleteEnabled : true,

        generatedColumns : readonly [],
        nullableColumns : readonly [],
        explicitDefaultValueColumns : readonly [],
        mutableColumns : readonly [],

        parents : readonly [],
    }>
);
/**
 * Creates a table with the given alias
 *
 * @param tableAlias
 */
export function fromTableAlias<
    TableAliasT extends string
> (
    tableAlias : TableAliasT
) : (
    FromTableAlias<TableAliasT>
) {
    const result : FromTableAlias<TableAliasT> = new Table(
        {
            lateral : false,
            tableAlias,
            columns : {},
            usedRef : {},

            autoIncrement : undefined,
            id : undefined,
            primaryKey : undefined,
            candidateKeys : [],

            insertEnabled : true,
            deleteEnabled : true,

            generatedColumns : [],
            nullableColumns : [],
            explicitDefaultValueColumns : [],
            mutableColumns : [],

            parents : [],
        } as const,
        escapeIdentifier(tableAlias)
    );
    return result;
}

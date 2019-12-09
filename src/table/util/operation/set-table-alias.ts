import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnMapUtil} from "../../../column-map";
import {identifierNode, isIdentifierNode} from "../../../ast";

export type SetTableAlias<TableT extends ITable, NewTableAliasT extends string> = (
    Table<{
        isLateral : TableT["isLateral"],
        alias : NewTableAliasT,
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

        explicitAutoIncrementValueEnabled : TableT["explicitAutoIncrementValueEnabled"],
    }>
);
/**
 * Changes the alias of the table.
 *
 * Useful if you have multiple tables with exactly the same structure.
 *
 * This is different from `.as()`!
 *
 * -----
 *
 * You will have to call `.setSchemaName()` again if you called it before.
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
        isLateral,
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

        explicitAutoIncrementValueEnabled,
    } = table;

    return new Table(
        {
            isLateral,
            alias : newTableAlias,
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

            explicitAutoIncrementValueEnabled,
        },
        (
            (
                isIdentifierNode(table.unaliasedAst) &&
                table.unaliasedAst.identifiers.length == 2
            ) ?
            identifierNode(
                //The `schemaName`
                table.unaliasedAst.identifiers[0],
                newTableAlias
            ) :
            identifierNode(newTableAlias)
        )
    );
}

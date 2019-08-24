import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnArrayUtil} from "../../../column";
import {KeyUtil} from "../../../key";

/**
 * Helper type to get all column aliases that can be mutable.
 *
 * Generated columns cannot be mutable.
 */
export type AddAllMutableColumnAlias<TableT extends Pick<ITable, "columns"|"generatedColumns">> = (
    Exclude<
        Extract<keyof TableT["columns"], string>,
        TableT["generatedColumns"][number]
    >
);

/**
 * Makes all non-generated columns mutable.
 *
 * + Mutable columns may be modified with `UPDATE` statements using this library.
 * + Immutable columns may not be modified with this library
 *   (but could still be modified outside of this library)
 *
 */
export type AddAllMutable<
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
         * All non-generated columns are now mutable.
         */
        mutableColumns : readonly AddAllMutableColumnAlias<TableT>[],
    }>
);

/**
 * Makes all non-generated columns mutable.
 *
 * + Mutable columns may be modified with `UPDATE` statements using this library.
 * + Immutable columns may not be modified with this library
 *   (but could still be modified outside of this library)
 *
 * @param table
 */
export function addAllMutable<
    TableT extends ITable
> (
    table : TableT
) : (
    AddAllMutable<TableT>
) {
    const mutableColumns = (
        KeyUtil.fromColumnArray(
            ColumnArrayUtil
                .fromColumnMap(table.columns)
                .filter(column => {
                    return (
                        !table.generatedColumns.includes(column.columnAlias)
                    );
                })
        )
    ) as readonly AddAllMutableColumnAlias<TableT>[];

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


    const result : AddAllMutable<TableT> = new Table(
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

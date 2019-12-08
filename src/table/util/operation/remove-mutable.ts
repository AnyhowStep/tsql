import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

export type RemoveMutableColumnAlias<TableT extends Pick<ITable, "columns"|"mutableColumns">> = (
    Extract<keyof TableT["columns"], TableT["mutableColumns"][number]>
);
export type RemoveMutableColumnMap<TableT extends Pick<ITable, "columns"|"mutableColumns">> = (
    {
        readonly [columnAlias in RemoveMutableColumnAlias<TableT>] : (
            TableT["columns"][columnAlias]
        )
    }
);
export function removeMutableColumnMap<
    TableT extends Pick<ITable, "columns"|"mutableColumns">
> (
    table : TableT
) : (
    RemoveMutableColumnMap<TableT>
) {
    const result : RemoveMutableColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => {
                return (
                    table.mutableColumns.includes(column.columnAlias)
                );
            })
            .map(column => column.columnAlias)
    ) as RemoveMutableColumnMap<TableT>;
    return result;
}
export type RemoveMutableDelegate<
    TableT extends Pick<ITable, "columns"|"mutableColumns">,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<RemoveMutableColumnMap<TableT>>[]
> = (
    (columnMap : RemoveMutableColumnMap<TableT>) => ColumnsT
);

export type RemoveMutable<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<RemoveMutableColumnMap<TableT>>[]
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
         * Subtract from `mutableColumns`
         */
        mutableColumns : KeyUtil.Subtract<
            TableT["mutableColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >,

        explicitAutoIncrementValueEnabled : TableT["explicitAutoIncrementValueEnabled"],
    }>
);
/**
 * Removes columns from the set of mutable columns.
 *
 * You will not be able to update them through this library.
 *
 * @param table
 * @param delegate
 */
export function removeMutable<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<RemoveMutableColumnMap<TableT>>[]
> (
    table : TableT,
    delegate : (
        RemoveMutableDelegate<
            TableT,
            ColumnsT
        >
    )
) : (
    RemoveMutable<TableT, ColumnsT>
) {
    const columnMap = removeMutableColumnMap(table);
    const columnsT : ColumnsT = delegate(columnMap);

    ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
        columnMap,
        columnsT
    );

    const mutableColumns : (
        KeyUtil.Subtract<
            TableT["mutableColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.subtract(
        table.mutableColumns,
        KeyUtil.fromColumnArray(columnsT)
    );

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

        explicitAutoIncrementValueEnabled,
    } = table;


    const result : RemoveMutable<TableT, ColumnsT> = new Table(
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
        table.unaliasedAst
    );
    return result;
}

import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

export type RemoveGeneratedColumnAlias<TableT extends Pick<ITable, "columns"|"generatedColumns">> = (
    Extract<keyof TableT["columns"], TableT["generatedColumns"][number]>
);
export type RemoveGeneratedColumnMap<TableT extends Pick<ITable, "columns"|"generatedColumns">> = (
    {
        readonly [columnAlias in RemoveGeneratedColumnAlias<TableT>] : (
            TableT["columns"][columnAlias]
        )
    }
);
export function removeGeneratedColumnMap<
    TableT extends Pick<ITable, "columns"|"generatedColumns">
> (
    table : TableT
) : (
    RemoveGeneratedColumnMap<TableT>
) {
    const result : RemoveGeneratedColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => {
                return (
                    table.generatedColumns.includes(column.columnAlias)
                );
            })
            .map(column => column.columnAlias)
    ) as RemoveGeneratedColumnMap<TableT>;
    return result;
}
export type RemoveGeneratedDelegate<
    TableT extends Pick<ITable, "columns"|"generatedColumns">,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<RemoveGeneratedColumnMap<TableT>>[]
> = (
    (columnMap : RemoveGeneratedColumnMap<TableT>) => ColumnsT
);

export type RemoveGenerated<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<RemoveGeneratedColumnMap<TableT>>[]
> = (
    Table<{
        isLateral : TableT["isLateral"],
        tableAlias : TableT["tableAlias"],
        columns : TableT["columns"],
        usedRef : TableT["usedRef"],

        autoIncrement : TableT["autoIncrement"],
        id : TableT["id"],
        primaryKey : TableT["primaryKey"],
        candidateKeys : TableT["candidateKeys"],

        insertEnabled : TableT["insertEnabled"],
        deleteEnabled : TableT["deleteEnabled"],

        /**
         * Subtract from `generatedColumns`
         */
        generatedColumns : KeyUtil.Subtract<
            TableT["generatedColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >,
        nullableColumns : TableT["nullableColumns"],
        explicitDefaultValueColumns : TableT["explicitDefaultValueColumns"],
        /**
         * The column is no longer generated and you may make it
         * mutable by using `.addMutable()`
         */
        mutableColumns : TableT["mutableColumns"],

        parents : TableT["parents"],
    }>
);
/**
 * Removes columns from the set of `GENERATED` columns.
 *
 * @param table
 * @param delegate
 */
export function removeGenerated<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<RemoveGeneratedColumnMap<TableT>>[]
> (
    table : TableT,
    delegate : (
        RemoveGeneratedDelegate<
            TableT,
            ColumnsT
        >
    )
) : (
    RemoveGenerated<TableT, ColumnsT>
) {
    const columnMap = removeGeneratedColumnMap(table);
    const columnsT : ColumnsT = delegate(columnMap);

    ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
        columnMap,
        columnsT
    );

    const generatedColumns : (
        KeyUtil.Subtract<
            TableT["generatedColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.subtract(
        table.generatedColumns,
        KeyUtil.fromColumnArray(columnsT)
    );

    const {
        isLateral: isLateral,
        tableAlias,
        columns,
        usedRef,

        autoIncrement,
        id,
        primaryKey,
        candidateKeys,

        insertEnabled,
        deleteEnabled,

        //generatedColumns,
        nullableColumns,
        explicitDefaultValueColumns,
        mutableColumns,

        parents,
    } = table;


    const result : RemoveGenerated<TableT, ColumnsT> = new Table(
        {
            isLateral,
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
        table.unaliasedAst
    );
    return result;
}

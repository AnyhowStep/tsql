import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

/**
 * Generated columns cannot be mutable.
 */
export type AddMutableColumnAlias<TableT extends Pick<ITable, "columns"|"generatedColumns"|"mutableColumns">> = (
    Exclude<
        Extract<keyof TableT["columns"], string>,
        (
            | TableT["generatedColumns"][number]
            | TableT["mutableColumns"][number]
        )
    >
);
export type AddMutableColumnMap<TableT extends Pick<ITable, "columns"|"generatedColumns"|"mutableColumns">> = (
    {
        readonly [columnAlias in AddMutableColumnAlias<TableT>] : (
            TableT["columns"][columnAlias]
        )
    }
);
export function addMutableColumnMap<
    TableT extends Pick<ITable, "columns"|"generatedColumns"|"mutableColumns">
> (
    table : TableT
) : (
    AddMutableColumnMap<TableT>
) {
    const result : AddMutableColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => {
                return (
                    !table.generatedColumns.includes(column.columnAlias) &&
                    !table.mutableColumns.includes(column.columnAlias)
                );
            })
            .map(column => column.columnAlias)
    ) as AddMutableColumnMap<TableT>;
    return result;
}
export type AddMutableDelegate<
    TableT extends Pick<ITable, "columns"|"generatedColumns"|"mutableColumns">,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AddMutableColumnMap<TableT>>[]
> = (
    (columnMap : AddMutableColumnMap<TableT>) => ColumnsT
);

export type AddMutable<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AddMutableColumnMap<TableT>>[]
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
         * Our new mutable columns
         */
        mutableColumns : KeyUtil.Concat<
            TableT["mutableColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >,

        parents : TableT["parents"],
    }>
);
/**
 * Lets these columns be updated through this library.
 *
 * @param table
 * @param delegate
 */
export function addMutable<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AddMutableColumnMap<TableT>>[]
> (
    table : TableT,
    delegate : (
        AddMutableDelegate<
            TableT,
            ColumnsT
        >
    )
) : (
    AddMutable<TableT, ColumnsT>
) {
    const columnMap = addMutableColumnMap(table);
    const columnsT : ColumnsT = delegate(columnMap);

    ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
        columnMap,
        columnsT
    );

    const mutableColumns : (
        KeyUtil.Concat<
            TableT["mutableColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.concat(
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

        parents,
    } = table;


    const result : AddMutable<TableT, ColumnsT> = new Table(
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

            parents,
        },
        table.unaliasedAst
    );
    return result;
}

import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

export type AddGeneratedColumnAlias<TableT extends Pick<ITable, "columns"|"generatedColumns">> = (
    Exclude<
        Extract<keyof TableT["columns"], string>,
        TableT["generatedColumns"][number]
    >
);
export type AddGeneratedColumnMap<TableT extends Pick<ITable, "columns"|"generatedColumns">> = (
    {
        readonly [columnAlias in AddGeneratedColumnAlias<TableT>] : (
            TableT["columns"][columnAlias]
        )
    }
);
export function addGeneratedColumnMap<
    TableT extends Pick<ITable, "columns"|"generatedColumns">
> (
    table : TableT
) : (
    AddGeneratedColumnMap<TableT>
) {
    const result : AddGeneratedColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => {
                return (
                    !table.generatedColumns.includes(column.columnAlias)
                );
            })
            .map(column => column.columnAlias)
    ) as AddGeneratedColumnMap<TableT>;
    return result;
}
export type AddGeneratedDelegate<
    TableT extends Pick<ITable, "columns"|"generatedColumns">,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AddGeneratedColumnMap<TableT>>[]
> = (
    (columnMap : AddGeneratedColumnMap<TableT>) => ColumnsT
);

export type AddGenerated<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AddGeneratedColumnMap<TableT>>[]
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

        /**
         * Our new generated columns.
         */
        generatedColumns : KeyUtil.Concat<
            TableT["generatedColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >,
        nullableColumns : TableT["nullableColumns"],
        /**
         * Generated columns have implicit default values.
         * Not explicit.
         */
        explicitDefaultValueColumns : KeyUtil.Subtract<
            TableT["explicitDefaultValueColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >,
        /**
         * Generated columns cannot be mutable.
         * Their value is controlled by the database server.
         */
        mutableColumns : KeyUtil.Subtract<
            TableT["mutableColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >,
    }>
);
/**
 * Adds a `GENERATED` column to the table.
 *
 * + Setting generated column values will not be allowed with `INSERT` statements.
 * + Updating generated column values will also not be allowed with `UPDATE` statements.
 *
 * @param table
 * @param delegate
 */
export function addGenerated<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AddGeneratedColumnMap<TableT>>[]
> (
    table : TableT,
    delegate : (
        AddGeneratedDelegate<
            TableT,
            ColumnsT
        >
    )
) : (
    AddGenerated<TableT, ColumnsT>
) {
    const columnMap = addGeneratedColumnMap(table);
    const columnsT : ColumnsT = delegate(columnMap);

    ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
        columnMap,
        columnsT
    );

    const generatedColumns : (
        KeyUtil.Concat<
            TableT["generatedColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.concat(
        table.generatedColumns,
        KeyUtil.fromColumnArray(columnsT)
    );
    const explicitDefaultValueColumns : (
        KeyUtil.Subtract<
            TableT["explicitDefaultValueColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.subtract(
        table.explicitDefaultValueColumns,
        KeyUtil.fromColumnArray(columnsT)
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

        //generatedColumns,
        nullableColumns,
        //explicitDefaultValueColumns,
        //mutableColumns,
    } = table;


    const result : AddGenerated<TableT, ColumnsT> = new Table(
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

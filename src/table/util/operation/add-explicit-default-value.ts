import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

/**
 * + Generated columns have implicit default values
 * + nullable columns have implicit default values
 * + `AUTO_INCREMENT` columns have implicit default values
 */
export type AddExplicitDefaultValueColumnAlias<
    TableT extends Pick<ITable, "columns"|"generatedColumns"|"nullableColumns"|"autoIncrement"|"explicitDefaultValueColumns">
> = (
    Exclude<
        Extract<keyof TableT["columns"], string>,
        (
            | TableT["generatedColumns"][number]
            | TableT["nullableColumns"][number]
            | TableT["autoIncrement"]
            | TableT["explicitDefaultValueColumns"][number]
        )
    >
);
export type AddExplicitDefaultValueColumnMap<
    TableT extends Pick<ITable, "columns"|"generatedColumns"|"nullableColumns"|"autoIncrement"|"explicitDefaultValueColumns">
> = (
    {
        readonly [columnAlias in AddExplicitDefaultValueColumnAlias<TableT>] : (
            TableT["columns"][columnAlias]
        )
    }
);
export function addExplicitDefaultValueColumnMap<
    TableT extends Pick<ITable, "columns"|"generatedColumns"|"nullableColumns"|"autoIncrement"|"explicitDefaultValueColumns">
> (
    table : TableT
) : (
    AddExplicitDefaultValueColumnMap<TableT>
) {
    const result : AddExplicitDefaultValueColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => {
                return (
                    !table.generatedColumns.includes(column.columnAlias) &&
                    !table.nullableColumns.includes(column.columnAlias) &&
                    (table.autoIncrement != column.columnAlias) &&
                    !table.explicitDefaultValueColumns.includes(column.columnAlias)
                );
            })
            .map(column => column.columnAlias)
    ) as AddExplicitDefaultValueColumnMap<TableT>;
    return result;
}
export type AddExplicitDefaultValueDelegate<
    TableT extends Pick<ITable, "columns"|"generatedColumns"|"nullableColumns"|"autoIncrement"|"explicitDefaultValueColumns">,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AddExplicitDefaultValueColumnMap<TableT>>[]
> = (
    (columnMap : AddExplicitDefaultValueColumnMap<TableT>) => ColumnsT
);

export type AddExplicitDefaultValue<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AddExplicitDefaultValueColumnMap<TableT>>[]
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
        /**
         * Our new columns with explicit default values
         */
        explicitDefaultValueColumns : KeyUtil.Concat<
            TableT["explicitDefaultValueColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >,
        mutableColumns : TableT["mutableColumns"],

        parents : TableT["parents"],
    }>
);
/**
 * Tells the library that these columns have explicit `DEFAULT` values.
 *
 * An example of an "explicit" default value,
 * ```sql
 * `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
 * ```
 *
 * + Columns with server default values are optional with `INSERT` statements.
 * + Generated columns have implicit default values.
 * + Nullable columns have implicit default values.
 * + `AUTO_INCREMENT` columns have implicit default values
 *
 * -----
 *
 * @param table
 * @param delegate
 */
export function addExplicitDefaultValue<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AddExplicitDefaultValueColumnMap<TableT>>[]
> (
    table : TableT,
    delegate : (
        AddExplicitDefaultValueDelegate<
            TableT,
            ColumnsT
        >
    )
) : (
    AddExplicitDefaultValue<TableT, ColumnsT>
) {
    const columnMap = addExplicitDefaultValueColumnMap(table);
    const columnsT : ColumnsT = delegate(columnMap);

    ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
        columnMap,
        columnsT
    );

    const explicitDefaultValueColumns : (
        KeyUtil.Concat<
            TableT["explicitDefaultValueColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.concat(
        table.explicitDefaultValueColumns,
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
        //explicitDefaultValueColumns,
        mutableColumns,

        parents,
    } = table;


    const result : AddExplicitDefaultValue<TableT, ColumnsT> = new Table(
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

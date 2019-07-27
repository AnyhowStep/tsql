import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

export type AllowedGeneratedColumnAlias<TableT extends Pick<ITable, "columns"|"generatedColumns">> = (
    Exclude<
        Extract<keyof TableT["columns"], string>,
        TableT["generatedColumns"][number]
    >
);
export type AllowedGeneratedColumnMap<TableT extends Pick<ITable, "columns"|"generatedColumns">> = (
    {
        readonly [columnAlias in AllowedGeneratedColumnAlias<TableT>] : (
            TableT["columns"][columnAlias]
        )
    }
);
export function allowedGeneratedColumnMap<
    TableT extends Pick<ITable, "columns"|"generatedColumns">
> (
    table : TableT
) : (
    AllowedGeneratedColumnMap<TableT>
) {
    const result : AllowedGeneratedColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => {
                return (
                    !table.generatedColumns.includes(column.columnAlias)
                );
            })
            .map(column => column.columnAlias)
    ) as AllowedGeneratedColumnMap<TableT>;
    return result;
}
export type GeneratedDelegate<
    TableT extends Pick<ITable, "columns"|"generatedColumns">,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AllowedGeneratedColumnMap<TableT>>[]
> = (
    (columnMap : AllowedGeneratedColumnMap<TableT>) => ColumnsT
);

export type AddGenerated<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AllowedGeneratedColumnMap<TableT>>[]
> = (
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

        /**
         * Our new generated columns
         */
        generatedColumns : KeyUtil.Concat<
            TableT["generatedColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >,
        nullableColumns : TableT["nullableColumns"],
        /**
         * Generated columns have explicit default values
         */
        explicitDefaultValueColumns : KeyUtil.Concat<
            TableT["explicitDefaultValueColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >,
        /**
         * Generated columns cannot be mutable
         */
        mutableColumns : KeyUtil.Subtract<
            TableT["mutableColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >,

        parents : TableT["parents"],
    }>
);
export function addGenerated<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AllowedGeneratedColumnMap<TableT>>[]
> (
    table : TableT,
    delegate : (
        GeneratedDelegate<
            TableT,
            ColumnsT
        >
    )
) : (
    AddGenerated<TableT, ColumnsT>
) {
    const allowedColumns = allowedGeneratedColumnMap(table);
    const newGenerated : ColumnsT = delegate(allowedColumns);

    ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
        allowedColumns,
        newGenerated
    );

    const generatedColumns : (
        KeyUtil.Concat<
            TableT["generatedColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.concat(
        table.generatedColumns,
        KeyUtil.fromColumnArray(newGenerated)
    );
    const explicitDefaultValueColumns : (
        KeyUtil.Concat<
            TableT["explicitDefaultValueColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.concat(
        table.explicitDefaultValueColumns,
        KeyUtil.fromColumnArray(newGenerated)
    );
    const mutableColumns : (
        KeyUtil.Subtract<
            TableT["mutableColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.subtract(
        table.mutableColumns,
        KeyUtil.fromColumnArray(newGenerated)
    );

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

        //generatedColumns,
        nullableColumns,
        //explicitDefaultValueColumns,
        //mutableColumns,

        parents,
    } = table;


    const result : AddGenerated<TableT, ColumnsT> = new Table(
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
        table.unaliasedAst
    );
    return result;
}

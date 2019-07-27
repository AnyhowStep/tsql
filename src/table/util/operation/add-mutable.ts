import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

/**
 * Generated columns cannot be mutable.
 */
export type AllowedMutableColumnAlias<TableT extends Pick<ITable, "columns"|"generatedColumns"|"mutableColumns">> = (
    Exclude<
        Extract<keyof TableT["columns"], string>,
        (
            | TableT["generatedColumns"][number]
            | TableT["mutableColumns"][number]
        )
    >
);
export type AllowedMutableColumnMap<TableT extends Pick<ITable, "columns"|"generatedColumns"|"mutableColumns">> = (
    {
        readonly [columnAlias in AllowedMutableColumnAlias<TableT>] : (
            TableT["columns"][columnAlias]
        )
    }
);
export function allowedMutableColumnMap<
    TableT extends Pick<ITable, "columns"|"generatedColumns"|"mutableColumns">
> (
    table : TableT
) : (
    AllowedMutableColumnMap<TableT>
) {
    const result : AllowedMutableColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => {
                return (
                    !table.generatedColumns.includes(column.columnAlias) &&
                    !table.mutableColumns.includes(column.columnAlias)
                );
            })
            .map(column => column.columnAlias)
    ) as AllowedMutableColumnMap<TableT>;
    return result;
}
export type MutableDelegate<
    TableT extends Pick<ITable, "columns"|"generatedColumns"|"mutableColumns">,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AllowedMutableColumnMap<TableT>>[]
> = (
    (columnMap : AllowedMutableColumnMap<TableT>) => ColumnsT
);

export type AddMutable<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AllowedMutableColumnMap<TableT>>[]
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
export function addMutable<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AllowedMutableColumnMap<TableT>>[]
> (
    table : TableT,
    delegate : (
        MutableDelegate<
            TableT,
            ColumnsT
        >
    )
) : (
    AddMutable<TableT, ColumnsT>
) {
    const allowedColumns = allowedMutableColumnMap(table);
    const newMutable : ColumnsT = delegate(allowedColumns);

    ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
        allowedColumns,
        newMutable
    );

    const mutableColumns : (
        KeyUtil.Concat<
            TableT["mutableColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.concat(
        table.mutableColumns,
        KeyUtil.fromColumnArray(newMutable)
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

        generatedColumns,
        nullableColumns,
        explicitDefaultValueColumns,
        //mutableColumns,

        parents,
    } = table;


    const result : AddMutable<TableT, ColumnsT> = new Table(
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

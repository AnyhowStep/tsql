import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";
import {assertHasColumnIdentifiers} from "../predicate";

export type AllowedExplicitDefaultValueColumnAlias<TableT extends Pick<ITable, "columns"|"explicitDefaultValueColumns">> = (
    Exclude<
        Extract<keyof TableT["columns"], string>,
        TableT["explicitDefaultValueColumns"][number]
    >
);
export type AllowedExplicitDefaultValueColumnMap<TableT extends Pick<ITable, "columns"|"explicitDefaultValueColumns">> = (
    {
        readonly [columnAlias in AllowedExplicitDefaultValueColumnAlias<TableT>] : (
            TableT["columns"][columnAlias]
        )
    }
);
export function allowedExplicitDefaultValueColumnMap<
    TableT extends Pick<ITable, "columns"|"explicitDefaultValueColumns">
> (
    table : TableT
) : (
    AllowedExplicitDefaultValueColumnMap<TableT>
) {
    const result : AllowedExplicitDefaultValueColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => {
                return (
                    !table.explicitDefaultValueColumns.includes(column.columnAlias)
                );
            })
            .map(column => column.columnAlias)
    ) as AllowedExplicitDefaultValueColumnMap<TableT>;
    return result;
}
export type ExplicitDefaultValueDelegate<
    TableT extends Pick<ITable, "columns"|"explicitDefaultValueColumns">,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AllowedExplicitDefaultValueColumnMap<TableT>>[]
> = (
    (columnMap : AllowedExplicitDefaultValueColumnMap<TableT>) => ColumnsT
);

export type AddExplicitDefaultValue<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AllowedExplicitDefaultValueColumnMap<TableT>>[]
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

        insertAllowed : TableT["insertAllowed"],
        deleteAllowed : TableT["deleteAllowed"],

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
export function addExplicitDefaultValue<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<AllowedExplicitDefaultValueColumnMap<TableT>>[]
> (
    table : TableT,
    delegate : (
        ExplicitDefaultValueDelegate<
            TableT,
            ColumnsT
        >
    )
) : (
    AddExplicitDefaultValue<TableT, ColumnsT>
) {
    const newExplicitDefaultValue : ColumnsT = delegate(allowedExplicitDefaultValueColumnMap(table));

    assertHasColumnIdentifiers(table, newExplicitDefaultValue);

    const explicitDefaultValueColumns : (
        KeyUtil.Concat<
            TableT["explicitDefaultValueColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.concat(
        table.explicitDefaultValueColumns,
        KeyUtil.fromColumnArray(newExplicitDefaultValue)
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

        insertAllowed,
        deleteAllowed,

        generatedColumns,
        nullableColumns,
        //explicitDefaultValueColumns,
        mutableColumns,

        parents,
    } = table;


    const result : AddExplicitDefaultValue<TableT, ColumnsT> = new Table(
        {
            lateral,
            tableAlias,
            columns,
            usedRef,

            autoIncrement,
            id,
            primaryKey,
            candidateKeys,

            insertAllowed,
            deleteAllowed,

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

import * as tm from "type-mapping";
import {ITable, TableData} from "../../table";
import {Table} from "../../table-impl";
import {ColumnMapUtil} from "../../../column-map";

export type AddColumnsFromFieldArray<
    TableT extends ITable,
    FieldsT extends readonly tm.AnyField[]
> = (
    Table<{
        isLateral : TableT["isLateral"],
        alias : TableT["alias"],
        columns : ColumnMapUtil.Intersect<
            TableT["columns"],
            ColumnMapUtil.FromFieldArray<TableT["alias"], FieldsT>
        >,
        usedRef : TableT["usedRef"],

        autoIncrement : TableT["autoIncrement"],
        id : TableT["id"],
        primaryKey : TableT["primaryKey"],
        candidateKeys : TableT["candidateKeys"],

        insertEnabled : TableT["insertEnabled"],
        deleteEnabled : TableT["deleteEnabled"],

        generatedColumns : TableT["generatedColumns"],
        nullableColumns : ColumnMapUtil.NullableColumnAlias<
            ColumnMapUtil.Intersect<
                TableT["columns"],
                ColumnMapUtil.FromFieldArray<TableT["alias"], FieldsT>
            >
        >[],
        explicitDefaultValueColumns : TableT["explicitDefaultValueColumns"],
        mutableColumns : TableT["mutableColumns"],

        explicitAutoIncrementValueEnabled : TableT["explicitAutoIncrementValueEnabled"],
    }>
);
/**
 * Converts an array of fields to columns of the table
 *
 * @param table
 * @param fields
 *
 * @deprecated
 */
export function addColumnsFromFieldArray<
    TableT extends ITable,
    FieldsT extends readonly tm.AnyField[]
> (
    table : TableT,
    fields : FieldsT
) : (
    AddColumnsFromFieldArray<TableT, FieldsT>
) {
    //https://github.com/Microsoft/TypeScript/issues/28592
    const tableColumns: TableT["columns"] = table.columns;
    //https://github.com/Microsoft/TypeScript/issues/28592
    const columnMapFromFieldArray = ColumnMapUtil.fromFieldArray<TableT["alias"], FieldsT>(
        table.alias,
        fields
    );
    const columns : (
        ColumnMapUtil.Intersect<
            TableT["columns"],
            ColumnMapUtil.FromFieldArray<TableT["alias"], FieldsT>
        >
    ) = ColumnMapUtil.intersect(
        tableColumns,
        columnMapFromFieldArray
    );
    const nullableColumns = ColumnMapUtil.nullableColumnAliases(columns);

    const result : AddColumnsFromFieldArray<TableT, FieldsT> = new Table(
        {
            /**
             * This fails,
             * ```ts
             * ...table
             * ```
             *
             * This fails,
             * ```ts
             * ...(table as ITable)
             * ```
             *
             * This succeeds,
             * ```ts
             * ...(table as TableData)
             * ```
             *
             * @todo Investigate and possibly file issue
             */
            ...(table as TableData),
            columns,
            nullableColumns,
        },
        table.unaliasedAst
    );
    return result;
}

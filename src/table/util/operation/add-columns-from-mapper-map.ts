import {ITable, TableData} from "../../table";
import {Table} from "../../table-impl";
import {MapperMap} from "../../../mapper-map";
import {ColumnMapUtil} from "../../../column-map";

export type AddColumnsFromMapperMap<
    TableT extends ITable,
    MapperMapT extends MapperMap
> = (
    Table<{
        isLateral : TableT["isLateral"],
        alias : TableT["alias"],
        columns : ColumnMapUtil.Intersect<
            TableT["columns"],
            ColumnMapUtil.FromMapperMap<TableT["alias"], MapperMapT>
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
                ColumnMapUtil.FromMapperMap<TableT["alias"], MapperMapT>
            >
        >[],
        explicitDefaultValueColumns : TableT["explicitDefaultValueColumns"],
        mutableColumns : TableT["mutableColumns"],

        parents : TableT["parents"],
    }>
);
/**
 * Converts a map of `columnAlias -> mapper` to columns of the table
 *
 * @param table
 * @param mapperMap
 */
export function addColumnsFromMapperMap<
    TableT extends ITable,
    MapperMapT extends MapperMap
> (
    table : TableT,
    mapperMap : MapperMapT
) : (
    AddColumnsFromMapperMap<TableT, MapperMapT>
) {
    //https://github.com/Microsoft/TypeScript/issues/28592
    const tableColumns: TableT["columns"] = table.columns;

    const columns : (
        ColumnMapUtil.Intersect<
            TableT["columns"],
            ColumnMapUtil.FromMapperMap<TableT["alias"], MapperMapT>
        >
    ) = ColumnMapUtil.intersect(
        tableColumns,
        ColumnMapUtil.fromMapperMap(table.alias, mapperMap)
    );
    const nullableColumns : (
        ColumnMapUtil.NullableColumnAlias<
            ColumnMapUtil.Intersect<
                TableT["columns"],
                ColumnMapUtil.FromMapperMap<TableT["alias"], MapperMapT>
            >
        >[]
    ) = ColumnMapUtil.nullableColumnAliases(columns);

    const result : AddColumnsFromMapperMap<TableT, MapperMapT> = new Table(
        {
            ...(table as TableData),
            columns,
            nullableColumns,
        },
        table.unaliasedAst
    );
    return result;
}

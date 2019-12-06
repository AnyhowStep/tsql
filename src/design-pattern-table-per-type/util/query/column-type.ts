import * as tm from "type-mapping";
import {ITablePerType} from "../../table-per-type";
import {TableUtil} from "../../../table";
import {ExtractAllTablesWithColumnAlias, extractAllTablesWithColumnAlias} from "./extract-all-tables-with-column-alias";
import {DataTypeUtil} from "../../../data-type";
import {ExtractTableWithAlias} from "./extract-table-with-alias";

/**
 * If `TableAliasT` is the only table with `ColumnAliasT`,
 * then this will return `never`.
 *
 * + `never extends true`.
 * + `true extends true`.
 *
 * So, just check if `HasSmallestColumnType<> extends true`.
 */
export type HasSmallestColumnType<
    TptT extends ITablePerType,
    TableAliasT extends string,
    ColumnAliasT extends string
> =
    {
        [otherTableAlias in Exclude<
            ExtractAllTablesWithColumnAlias<TptT, ColumnAliasT>["alias"],
            TableAliasT
        >] : (
            TableUtil.ColumnType<
                ExtractTableWithAlias<TptT, TableAliasT>,
                ColumnAliasT
            > extends TableUtil.ColumnType<
                ExtractTableWithAlias<TptT, otherTableAlias>,
                ColumnAliasT
            > ?
            //This is a subtype of the other types
            true :
            //This is not a subtype of the other types
            false
        )
    }[Exclude<
        ExtractAllTablesWithColumnAlias<TptT, ColumnAliasT>["alias"],
        TableAliasT
    >]
;

export type ColumnType<TptT extends ITablePerType, ColumnAliasT extends string> =
    {
        [tableAlias in ExtractAllTablesWithColumnAlias<TptT, ColumnAliasT>["alias"]] : (
            HasSmallestColumnType<TptT, tableAlias, ColumnAliasT> extends true ?
            TableUtil.ColumnType<
                ExtractTableWithAlias<TptT, tableAlias>,
                ColumnAliasT
            > :
            never
        )
    }[ExtractAllTablesWithColumnAlias<TptT, ColumnAliasT>["alias"]]
;

export function columnMapper<
    TptT extends ITablePerType,
    ColumnAliasT extends string
> (
    tpt : TptT,
    columnAlias : ColumnAliasT
) : tm.SafeMapper<ColumnType<TptT, ColumnAliasT>> {
    const mappers = extractAllTablesWithColumnAlias(tpt, columnAlias)
        .map(table => table.columns[columnAlias].mapper);
    if (mappers.length == 0) {
        throw new Error(`Table-per-type hierarchy for ${tpt.childTable.alias} does not have column alias ${columnAlias}`);
    }

    if (mappers.length == 1) {
        return mappers[0];
    }

    let result = DataTypeUtil.intersect(mappers[0], mappers[1]);
    for (let i=2; i<mappers.length; ++i) {
        result = DataTypeUtil.intersect(result, mappers[i]);
    }
    return result;
}

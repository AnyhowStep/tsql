import * as tm from "type-mapping";
import {ITablePerType} from "../../table-per-type";
import {ColumnAlias, columnAliases} from "./column-alias";
import {ColumnType, columnMapper} from "./column-type";
import {Identity} from "../../../type-util";

export type Row<TptT extends ITablePerType> =
    Identity<{
        [columnAlias in ColumnAlias<TptT>] : (
            ColumnType<TptT, columnAlias>
        )
    }>
;

export function rowMapper<TptT extends ITablePerType> (
    tpt : TptT
) : tm.SafeMapper<Row<TptT>> {
    const result = tm.objectFromArray(...columnAliases(tpt)
        .map(columnAlias => tm.withName(
            columnMapper(tpt, columnAlias),
            columnAlias
        ) as (
            & tm.SafeMapper<unknown>
            & tm.Name<string>
        )
    ));
    return result as tm.SafeMapper<Row<TptT>>;
}

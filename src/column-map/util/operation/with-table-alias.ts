import {ColumnMap, WritableColumnMap} from "../../column-map";
import {ColumnUtil} from "../../../column";
import {Identity} from "../../../type-util";

type WithTableAliasImpl<
    ColumnMapT extends ColumnMap,
    NewTableAliasT extends string,
    ColumnAliasT extends keyof ColumnMapT
> =
    Identity<{
        readonly [columnAlias in ColumnAliasT] : (
            ColumnUtil.WithTableAlias<
                ColumnMapT[columnAlias],
                NewTableAliasT
            >
        )
    }>
;
export type WithTableAlias<
    ColumnMapT extends ColumnMap,
    NewTableAliasT extends string
> =
    WithTableAliasImpl<
        ColumnMapT,
        NewTableAliasT,
        Extract<keyof ColumnMapT, string>
    >
;
export function withTableAlias<
    ColumnMapT extends ColumnMap,
    NewTableAliasT extends string
> (
    columnMap : ColumnMapT,
    newTableAlias : NewTableAliasT
) : (
    WithTableAlias<ColumnMapT, NewTableAliasT>
) {
    const result : WritableColumnMap = {};
    for (const columnAlias of Object.keys(columnMap)) {
        result[columnAlias] = ColumnUtil.withTableAlias(
            columnMap[columnAlias],
            newTableAlias
        );
    }
    return result as WithTableAlias<ColumnMapT, NewTableAliasT>;
}

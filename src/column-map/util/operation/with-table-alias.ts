import {ColumnMap, WritableColumnMap} from "../../column-map";
import {ColumnUtil} from "../../../column";

export type WithTableAlias<
    ColumnMapT extends ColumnMap,
    NewTableAliasT extends string
> = (
    {
        readonly [columnAlias in Extract<keyof ColumnMapT, string>] : (
            ColumnUtil.WithTableAlias<
                ColumnMapT[columnAlias],
                NewTableAliasT
            >
        )
    }
);
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
import {ColumnMap, WritableColumnMap} from "../../column-map";
import {ColumnUtil} from "../../../column";

export type ToNullable<ColumnMapT extends ColumnMap> = (
    {
        readonly [columnAlias in keyof ColumnMapT] : (
            ColumnUtil.ToNullable<ColumnMapT[columnAlias]>
        )
    }
);
export function toNullable<ColumnMapT extends ColumnMap> (
    columnMap : ColumnMapT
) : ToNullable<ColumnMapT> {
    const result : WritableColumnMap = {};
    for (const columnAlias of Object.keys(columnMap)) {
        result[columnAlias] = ColumnUtil.toNullable(columnMap[columnAlias]);
    }
    return result as ToNullable<ColumnMapT>;
}
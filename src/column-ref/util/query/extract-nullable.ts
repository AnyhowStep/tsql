import {ColumnRef, WritableColumnRef} from "../../column-ref";
import {ColumnMapUtil} from "../../../column-map";

export type ExtractNullable<
    RefT extends ColumnRef
> = (
    RefT extends ColumnRef ?
    {
        readonly [tableAlias in Extract<keyof RefT, string>] : (
            ColumnMapUtil.ExtractNullable<RefT[tableAlias]>
        )
    } :
    never
);

export function extractNullable<
    RefT extends ColumnRef
> (
    ref : RefT
) : (
    ExtractNullable<RefT>
) {
    const result : WritableColumnRef = {};
    for (const tableAlias of Object.keys(ref)) {
        result[tableAlias] = ColumnMapUtil.extractNullable(ref[tableAlias]);
    }
    return result as ExtractNullable<RefT>;
}

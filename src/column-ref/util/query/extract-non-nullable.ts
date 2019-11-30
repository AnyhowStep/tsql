import {ColumnRef, WritableColumnRef} from "../../column-ref";
import {ColumnMapUtil} from "../../../column-map";

export type ExtractNonNullable<
    RefT extends ColumnRef
> = (
    RefT extends ColumnRef ?
    {
        readonly [tableAlias in Extract<keyof RefT, string>] : (
            ColumnMapUtil.ExtractNonNullable<RefT[tableAlias]>
        )
    } :
    never
);

export function extractNonNullable<
    RefT extends ColumnRef
> (
    ref : RefT
) : (
    ExtractNonNullable<RefT>
) {
    const result : WritableColumnRef = {};
    for (const tableAlias of Object.keys(ref)) {
        result[tableAlias] = ColumnMapUtil.extractNonNullable(ref[tableAlias]);
    }
    return result as ExtractNonNullable<RefT>;
}

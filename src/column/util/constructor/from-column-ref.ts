import {ColumnRef} from "../../../column-ref";
import {FromColumnMap, fromColumnMap} from "./from-column-map";
import {IColumn} from "../../column";

export type FromColumnRef<ColumnRefT extends ColumnRef> = (
    ColumnRefT extends ColumnRef ?
    FromColumnMap<ColumnRefT[keyof ColumnRefT]> :
    never
);
export function fromColumnRef<
    ColumnRefT extends ColumnRef
> (
    ref : ColumnRefT
) : (
    FromColumnRef<ColumnRefT>[]
) {
    const result : IColumn[] = [];
    for (const tableAlias of Object.keys(ref)) {
        const map = ref[tableAlias];
        result.push(...fromColumnMap(map));
    }
    return result as FromColumnRef<ColumnRefT>[];
}

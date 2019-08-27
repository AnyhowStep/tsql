import {FromColumnMap, fromColumnMap} from "./from-column-map";
import {ColumnIdentifierRef} from "../../../column-identifier-ref";
import {ColumnIdentifier} from "../../column-identifier";

export type FromColumnRef<ColumnRefT extends ColumnIdentifierRef> = (
    ColumnRefT extends ColumnIdentifierRef ?
    FromColumnMap<ColumnRefT[Extract<keyof ColumnRefT, string>]> :
    never
);

export function fromColumnRef<
    ColumnRefT extends ColumnIdentifierRef
> (
    ref : ColumnRefT
) : (
    FromColumnRef<ColumnRefT>[]
) {
    const result : ColumnIdentifier[] = [];
    for (const tableAlias of Object.keys(ref)) {
        result.push(...fromColumnMap(ref[tableAlias]));
    }
    return result as FromColumnRef<ColumnRefT>[];
}

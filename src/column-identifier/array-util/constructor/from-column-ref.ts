import {ColumnIdentifier} from "../../column-identifier";
import * as ColumnIdentifierUtil from "../../util";
import {ColumnRef} from "../../../column-ref";
import {fromColumnMap} from "./from-column-map";

export type FromColumnRef<ColumnRefT extends ColumnRef> = (
    ColumnIdentifierUtil.FromColumnRef<ColumnRefT>[]
);
export function fromColumnRef<ColumnRefT extends ColumnRef> (
    columnRef : ColumnRefT
) : FromColumnRef<ColumnRefT> {
    const result : ColumnIdentifier[] = [];
    for (const tableAlias of Object.keys(columnRef)) {
        result.push(...fromColumnMap(
            columnRef[tableAlias]
        ));
    }
    return result as FromColumnRef<ColumnRefT>;
}
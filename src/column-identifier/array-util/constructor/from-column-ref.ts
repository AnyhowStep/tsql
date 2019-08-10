import {ColumnIdentifier} from "../../column-identifier";
import * as ColumnIdentifierUtil from "../../util";
import {fromColumnMap} from "./from-column-map";
import {ColumnIdentifierRef} from "../../../column-identifier-ref";

export type FromColumnRef<ColumnRefT extends ColumnIdentifierRef> = (
    ColumnIdentifierUtil.FromColumnRef<ColumnRefT>[]
);
export function fromColumnRef<ColumnRefT extends ColumnIdentifierRef> (
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

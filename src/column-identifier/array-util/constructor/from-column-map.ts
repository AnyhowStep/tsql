import {ColumnIdentifier} from "../../column-identifier";
import * as ColumnIdentifierUtil from "../../util";
import {ColumnIdentifierMap} from "../../../column-identifier-map";

export type FromColumnMap<ColumnMapT extends ColumnIdentifierMap> = (
    ColumnMapT extends ColumnIdentifierMap ?
    ColumnIdentifierUtil.FromColumnMap<ColumnMapT>[] :
    never
);
export function fromColumnMap<ColumnMapT extends ColumnIdentifierMap> (
    columnMap : ColumnMapT
) : FromColumnMap<ColumnMapT> {
    const result : ColumnIdentifier[] = [];
    for (const columnAlias of Object.keys(columnMap)) {
        result.push(ColumnIdentifierUtil.fromColumn(
            columnMap[columnAlias]
        ));
    }
    return result as FromColumnMap<ColumnMapT>;
}

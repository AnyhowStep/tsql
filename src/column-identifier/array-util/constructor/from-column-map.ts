import {ColumnIdentifier} from "../../column-identifier";
import * as ColumnIdentifierUtil from "../../util";
import {ColumnMap} from "../../../column-map";

export type FromColumnMap<ColumnMapT extends ColumnMap> = (
    ColumnMapT extends ColumnMap ?
    ColumnIdentifierUtil.FromColumnMap<ColumnMapT>[] :
    never
);
export function fromColumnMap<ColumnMapT extends ColumnMap> (
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
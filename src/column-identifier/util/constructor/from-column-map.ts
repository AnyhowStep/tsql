import {FromColumn, fromColumn} from "./from-column";
import {ColumnIdentifierMap} from "../../../column-identifier-map";
import {ColumnIdentifier} from "../../column-identifier";

export type FromColumnMap<ColumnMapT extends ColumnIdentifierMap> = (
    ColumnMapT extends ColumnIdentifierMap ?
    FromColumn<ColumnMapT[Extract<keyof ColumnMapT, string>]> :
    never
);

export function fromColumnMap<
    ColumnMapT extends ColumnIdentifierMap
> (
    map : ColumnMapT
) : (
    FromColumnMap<ColumnMapT>[]
) {
    const result : ColumnIdentifier[] = [];
    for (const columnAlias of Object.keys(map)) {
        result.push(fromColumn(map[columnAlias]));
    }
    return result as FromColumnMap<ColumnMapT>[];
}

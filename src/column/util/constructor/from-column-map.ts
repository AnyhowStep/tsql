import {ColumnMap} from "../../../column-map";
import {IColumn} from "../../column";

export type FromColumnMap<ColumnMapT extends ColumnMap> = (
    ColumnMapT extends ColumnMap ?
    ColumnMapT[Extract<keyof ColumnMapT, string>] :
    never
);
export function fromColumnMap<
    ColumnMapT extends ColumnMap
> (
    map : ColumnMapT
) : (
    FromColumnMap<ColumnMapT>[]
) {
    const result : IColumn[] = [];
    for (const columnAlias of Object.keys(map)) {
        result.push(map[columnAlias]);
    }
    return result as FromColumnMap<ColumnMapT>[];
}

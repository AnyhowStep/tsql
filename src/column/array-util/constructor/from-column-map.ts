import * as ColumnUtil from "../../util";
import {ColumnMap} from "../../../column-map";
import {IColumn} from "../../column";

export type FromColumnMap<ColumnMapT extends ColumnMap> = (
    ColumnMapT extends ColumnMap ?
    ColumnUtil.FromColumnMap<ColumnMapT>[] :
    never
);

export function fromColumnMap<
    ColumnMapT extends ColumnMap
> (
    columnMap : ColumnMapT
) : (
    FromColumnMap<ColumnMapT>
) {
    const result : IColumn[] = [];
    for (const columnAlias of Object.keys(columnMap)) {
        result.push(columnMap[columnAlias]);
    }
    return result as FromColumnMap<ColumnMapT>;
}

export function fromColumnMapArray<
    ColumnMapT extends ColumnMap
> (
    columnMapArr : readonly ColumnMapT[]
) : (
    FromColumnMap<ColumnMapT>
) {
    const result : IColumn[] = [];
    for (const columnMap of columnMapArr) {
        for (const columnAlias of Object.keys(columnMap)) {
            result.push(columnMap[columnAlias]);
        }
    }
    return result as FromColumnMap<ColumnMapT>;
}

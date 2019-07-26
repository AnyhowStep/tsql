import {IColumn} from "../../column";
import {SortDirection} from "../../../sort-direction";

export type Sort<ColumnT extends IColumn> = (
    readonly [ColumnT, SortDirection]
);
export function sort<
    ColumnT extends IColumn
> (column : ColumnT, sortDirection : SortDirection) : Sort<ColumnT> {
    return [column, sortDirection];
}
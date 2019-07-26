import {IColumn} from "../../column";
import {SortDirection} from "../../../sort-direction";

export type Asc<ColumnT extends IColumn> = (
    readonly [ColumnT, SortDirection.ASC]
);
export function asc<
    ColumnT extends IColumn
> (column : ColumnT) : Asc<ColumnT> {
    return [column, SortDirection.ASC];
}

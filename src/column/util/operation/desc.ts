import {IColumn} from "../../column";
import {SortDirection} from "../../../sort-direction";

export type Desc<ColumnT extends IColumn> = (
    readonly [ColumnT, SortDirection.DESC]
);
export function desc<
    ColumnT extends IColumn
> (column : ColumnT) : Desc<ColumnT> {
    return [column, SortDirection.DESC];
}
import {IColumn} from "../../../column";

export type FromColumn<ColumnT extends IColumn> = (
    ColumnT extends IColumn ?
    {
        readonly [columnAlias in ColumnT["columnAlias"]] : ColumnT
    } :
    never
);
export function fromColumn<ColumnT extends IColumn> (
    column : ColumnT
) : FromColumn<ColumnT> {
    return {
        [column.columnAlias] : column
    } as FromColumn<ColumnT>;
}

import {IColumn} from "../../../column";

export type FromColumn<
    ColumnT extends IColumn
> = (
    ColumnT extends IColumn ?
    readonly (ColumnT["columnAlias"])[] :
    never
);
export function fromColumn<
    ColumnT extends IColumn
> (
    column : ColumnT
) : (
    FromColumn<ColumnT>
) {
    const result : (
        readonly (ColumnT["columnAlias"])[]
    ) = [column.columnAlias];
    return result as FromColumn<ColumnT>;
}

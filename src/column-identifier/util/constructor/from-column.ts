import {IColumn} from "../../../column";

export type FromColumn<ColumnT extends IColumn> = (
    ColumnT extends IColumn ?
    {
        readonly tableAlias : ColumnT["tableAlias"],
        readonly columnAlias : ColumnT["columnAlias"],
    } :
    never
);
export function fromColumn<ColumnT extends IColumn> (
    column : ColumnT
) : FromColumn<ColumnT> {
    const result : {
        readonly tableAlias : ColumnT["tableAlias"],
        readonly columnAlias : ColumnT["columnAlias"],
    } = {
        tableAlias : column.tableAlias,
        columnAlias : column.columnAlias,
    };
    return result as FromColumn<ColumnT>;
}

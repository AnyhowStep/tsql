import {ColumnIdentifier} from "../../column-identifier";

export type FromColumn<ColumnT extends ColumnIdentifier> = (
    ColumnT extends ColumnIdentifier ?
    {
        readonly tableAlias : ColumnT["tableAlias"],
        readonly columnAlias : ColumnT["columnAlias"],
    } :
    never
);
export function fromColumn<ColumnT extends ColumnIdentifier> (
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

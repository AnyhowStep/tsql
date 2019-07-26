import {IColumn} from "../column";

export interface ColumnMap {
    readonly [columAlias : string] : IColumn
};
export interface WritableColumnMap {
    [columnAlias : string] : IColumn
}
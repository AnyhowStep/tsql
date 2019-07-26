import {ColumnIdentifier} from "../column-identifier";

export interface ColumnIdentifierMap {
    readonly [columnAlias : string] : ColumnIdentifier
};
export interface WritableColumnIdentifierMap {
    [columnAlias : string] : ColumnIdentifier
};
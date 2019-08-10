import {FromColumn} from "./from-column";
import {ColumnIdentifierMap} from "../../../column-identifier-map";

export type FromColumnMap<ColumnMapT extends ColumnIdentifierMap> = (
    ColumnMapT extends ColumnIdentifierMap ?
    FromColumn<ColumnMapT[Extract<keyof ColumnMapT, string>]> :
    never
);

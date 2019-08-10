import {FromColumnMap} from "./from-column-map";
import {ColumnIdentifierRef} from "../../../column-identifier-ref";

export type FromColumnRef<ColumnRefT extends ColumnIdentifierRef> = (
    ColumnRefT extends ColumnIdentifierRef ?
    FromColumnMap<ColumnRefT[Extract<keyof ColumnRefT, string>]> :
    never
);

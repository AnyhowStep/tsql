import {ColumnRef} from "../../../column-ref";
import {FromColumnMap} from "./from-column-map";

export type FromColumnRef<ColumnRefT extends ColumnRef> = (
    ColumnRefT extends ColumnRef ?
    FromColumnMap<ColumnRefT[keyof ColumnRefT]> :
    never
);
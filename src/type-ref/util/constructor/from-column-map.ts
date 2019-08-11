import {ColumnUtil} from "../../../column";
import {ColumnMap} from "../../../column-map";
import {FromColumnArray} from "./from-column-array";

export type FromColumnMap<MapT extends ColumnMap> = (
    FromColumnArray<
        ColumnUtil.FromColumnMap<MapT>[]
    >
);

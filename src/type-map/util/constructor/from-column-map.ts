import * as tm from "type-mapping";
import {ColumnMap} from "../../../column-map";

export type FromColumnMap<MapT extends ColumnMap> = (
    MapT extends ColumnMap ?
    {
        readonly [columnAlias in Extract<keyof MapT, string>] : (
            tm.OutputOf<MapT[columnAlias]["mapper"]>
        )
    } :
    never
);
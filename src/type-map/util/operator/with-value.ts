import {TypeMap} from "../../type-map";
import {Identity} from "../../../type-util";

export type WithValue<
    MapT extends TypeMap,
    ColumnAliasT extends string,
    ValueT extends unknown
> =
    Identity<{
        [columnAlias in Extract<keyof MapT, string>] : (
            ColumnAliasT extends columnAlias ?
            ValueT :
            MapT[columnAlias]
        )
    }>
;

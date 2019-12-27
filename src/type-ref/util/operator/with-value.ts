import {TypeRef} from "../../type-ref";
import {TypeMapUtil} from "../../../type-map";
import {Identity} from "../../../type-util";

export type WithValue<
    RefT extends TypeRef,
    TableAliasT extends string,
    ColumnAliasT extends string,
    ValueT extends unknown
> =
    Identity<{
        [tableAlias in Extract<keyof RefT, string>] : (
            TableAliasT extends tableAlias ?
            TypeMapUtil.WithValue<
                RefT[tableAlias],
                ColumnAliasT,
                ValueT
            > :
            RefT[tableAlias]
        )
    }>
;

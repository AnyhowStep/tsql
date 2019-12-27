import {IUsedRef} from "../../used-ref";
import {TypeRefUtil} from "../../../type-ref";

export type WithValue<
    UsedRefT extends IUsedRef,
    TableAliasT extends string,
    ColumnAliasT extends string,
    ValueT extends unknown
> =
    UsedRefT extends IUsedRef<infer RefT> ?
    IUsedRef<
        TypeRefUtil.WithValue<
            RefT,
            TableAliasT,
            ColumnAliasT,
            ValueT
        >
    > :
    never
;

import {ColumnRef} from "../../../column-ref";
import {TypeMapUtil} from "../../../type-map";

export type FromColumnRef<RefT extends ColumnRef> = (
    RefT extends ColumnRef ?
    {
        readonly [tableAlias in Extract<keyof RefT, string>] : (
            TypeMapUtil.FromColumnMap<RefT[tableAlias]>
        )
    } :
    never
);

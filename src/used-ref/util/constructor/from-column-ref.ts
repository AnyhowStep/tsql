import {ColumnRef} from "../../../column-ref";
import {IUsedRef} from "../../used-ref";
import {TypeRefUtil} from "../../../type-ref";

export type FromColumnRef<RefT extends ColumnRef> = (
    IUsedRef<TypeRefUtil.FromColumnRef<RefT>>
);

export function fromColumnRef<RefT extends ColumnRef> (
    ref : RefT
) : (
    FromColumnRef<RefT>
) {
    const result : FromColumnRef<RefT> = {
        __contravarianceMarker : () => {},
        columns : ref,
    };
    return result;
}

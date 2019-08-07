import {IUsedRef} from "../../used-ref";
import {TypeRefUtil} from "../../../type-ref";
import {TypeRef} from "../query";
import {ColumnIdentifierRefUtil, ColumnIdentifierRef} from "../../../column-identifier-ref";

/**
 * Assumes `U` is a union
 */
export type Intersect<
    U extends IUsedRef
> = (
    IUsedRef<
        TypeRefUtil.Intersect<
            TypeRef<U>
        >
    >
);
export function intersect<
    U extends IUsedRef
> (
    ...arr : readonly U[]
) : (
    Intersect<U>
) {
    let columns : ColumnIdentifierRef = {};
    for (const u of arr) {
        columns = ColumnIdentifierRefUtil.intersect(
            columns,
            u.columns
        );
    }
    const result : Intersect<U> = {
        __contravarianceMarker : () => {},
        columns,
    };
    return result;
}

import {ColumnRef} from "../../column-ref";
import {ColumnMapUtil} from "../../../column-map";

export type ExtractWithType<
    RefT extends ColumnRef,
    TypeT
> = (
    RefT extends ColumnRef ?
    {
        readonly [tableAlias in Extract<keyof RefT, string>] : (
            ColumnMapUtil.ExtractWithType<RefT[tableAlias], TypeT>
        )
    } :
    never
);

/**
 * Returns `ref` without modifying it.
 * Is basically a no-op.
 *
 * This function merely exists to enforce compile-time safety.
 */
export function __noOp_extractWithType<
    TypeT
> () : (
    <RefT extends ColumnRef>(ref : RefT) => ExtractWithType<RefT, TypeT>
) {
    return (ref) => ref as any;
}

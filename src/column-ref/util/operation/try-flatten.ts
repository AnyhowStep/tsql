import {ColumnRef} from "../../column-ref";
import {HasOneTable} from "../query/has-one-table";

export type TryFlatten<RefT extends ColumnRef> = (
    RefT extends ColumnRef ?
    (
        HasOneTable<RefT> extends true ?
        //Gives us a ColumnMap
        RefT[Extract<keyof RefT, string>] :
        //Gives us a ColumnRef
        RefT
    ) :
    never
);
export function tryFlatten<
    RefT extends ColumnRef
> (
    ref : RefT
) : (
    TryFlatten<RefT>
) {
    const tableAliases = Object.keys(ref);
    if (tableAliases.length == 1) {
        return ref[tableAliases[0]] as TryFlatten<RefT>;
    } else {
        return ref as TryFlatten<RefT>;
    }
}

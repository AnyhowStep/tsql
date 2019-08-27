import {ColumnIdentifierRef} from "../../column-identifier-ref";
import {HasOneTable} from "../predicate";

export type TryFlatten<RefT extends ColumnIdentifierRef> = (
    RefT extends ColumnIdentifierRef ?
    (
        HasOneTable<RefT> extends true ?
        //Gives us a ColumnIdentifierMap
        RefT[Extract<keyof RefT, string>] :
        //Gives us a ColumnIdentifierRef
        RefT
    ) :
    never
);
export function tryFlatten<
    RefT extends ColumnIdentifierRef
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

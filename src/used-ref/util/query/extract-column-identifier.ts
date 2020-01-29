import {IUsedRef} from "../../used-ref";
import {ColumnIdentifier} from "../../../column-identifier";
import {ColumnRefUtil} from "../../../column-ref";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";

export type ExtractColumnIdentifier<
    UsedRefT extends IUsedRef,
    ColumnIdentifierT extends ColumnIdentifier
> =
    UsedRefT extends IUsedRef<infer RefT> ?
    IUsedRef<
        ColumnRefUtil.ExtractColumnIdentifier_Mutable<
            RefT,
            ColumnIdentifierT
        >
    > :
    never
;

export function extractColumnIdentifiers<
    UsedRefT extends IUsedRef,
    ColumnIdentifierT extends ColumnIdentifier
> (
    usedRef : UsedRefT,
    columnIdentifiers : readonly ColumnIdentifierT[]
) : (
    ExtractColumnIdentifier<UsedRefT, ColumnIdentifierT>
) {
    const result : IUsedRef = {
        __contravarianceMarker : () => {},
        columns : ColumnIdentifierRefUtil.extractColumnIdentifiers(
            usedRef.columns,
            columnIdentifiers
        ),
    };
    return result as ExtractColumnIdentifier<UsedRefT, ColumnIdentifierT>;
}

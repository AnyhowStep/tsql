import {ColumnIdentifierRef, WritableColumnIdentifierRef} from "../../column-identifier-ref";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";
import {ColumnIdentifier} from "../../../column-identifier";
import {Identity} from "../../../type-util";

export type ExtractColumnIdentifier_TableAlias<
    RefT extends ColumnIdentifierRef,
    ColumnIdentifierT extends ColumnIdentifier
> =
    {
        [tableAlias in Extract<keyof RefT, string>] : (
            tableAlias extends ColumnIdentifierT["tableAlias"] ?
            tableAlias :
            never
        )
    }[Extract<keyof RefT, string>]
;

export type ExtractColumnIdentifier<
    RefT extends ColumnIdentifierRef,
    ColumnIdentifierT extends ColumnIdentifier
> =
    Identity<{
        readonly [tableAlias in ExtractColumnIdentifier_TableAlias<RefT, ColumnIdentifierT>] : (
            ColumnIdentifierMapUtil.ExtractColumnIdentifier<
                RefT[tableAlias],
                Extract<ColumnIdentifierT, { tableAlias : tableAlias }>
            >
        )
    }>
;

export function extractColumnIdentifiers<
    RefT extends ColumnIdentifierRef,
    ColumnIdentifierT extends ColumnIdentifier
> (
    ref : RefT,
    columnIdentifiers : readonly ColumnIdentifierT[]
) : (
    ExtractColumnIdentifier<RefT, ColumnIdentifierT>
) {
    const result : WritableColumnIdentifierRef = {};
    for (const tableAlias of Object.keys(ref)) {
        const arr = columnIdentifiers.filter(
            columnIdentifier => columnIdentifier.tableAlias == tableAlias
        );
        if (arr.length > 0) {
            result[tableAlias] = ColumnIdentifierMapUtil.extractColumnIdentifiers(ref[tableAlias], arr);
        }
    }
    return result as ExtractColumnIdentifier<RefT, ColumnIdentifierT>;
}

import {ColumnRef, WritableColumnRef} from "../../column-ref";
import {ColumnMapUtil} from "../../../column-map";
import {ColumnIdentifier} from "../../../column-identifier";
import {Identity} from "../../../type-util";

export type ExtractColumnIdentifier_TableAlias<
    RefT extends ColumnRef,
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

export type ExtractColumnIdentifier_Mutable<
    RefT extends ColumnRef,
    ColumnIdentifierT extends ColumnIdentifier
> =
    Identity<{
        [tableAlias in ExtractColumnIdentifier_TableAlias<RefT, ColumnIdentifierT>] : (
            ColumnMapUtil.ExtractColumnIdentifier_Mutable<
                RefT[tableAlias],
                Extract<ColumnIdentifierT, { tableAlias : tableAlias }>
            >
        )
    }>
;

export type ExtractColumnIdentifier<
    RefT extends ColumnRef,
    ColumnIdentifierT extends ColumnIdentifier
> =
    Identity<{
        readonly [tableAlias in ExtractColumnIdentifier_TableAlias<RefT, ColumnIdentifierT>] : (
            ColumnMapUtil.ExtractColumnIdentifier<
                RefT[tableAlias],
                Extract<ColumnIdentifierT, { tableAlias : tableAlias }>
            >
        )
    }>
;

export function extractColumnIdentifiers<
    RefT extends ColumnRef,
    ColumnIdentifierT extends ColumnIdentifier
> (
    ref : RefT,
    columnIdentifiers : readonly ColumnIdentifierT[]
) : (
    ExtractColumnIdentifier<RefT, ColumnIdentifierT>
) {
    const result : WritableColumnRef = {};
    for (const tableAlias of Object.keys(ref)) {
        const arr = columnIdentifiers.filter(
            columnIdentifier => columnIdentifier.tableAlias == tableAlias
        );
        if (arr.length > 0) {
            result[tableAlias] = ColumnMapUtil.extractColumnIdentifiers(ref[tableAlias], arr);
        }
    }
    return result as ExtractColumnIdentifier<RefT, ColumnIdentifierT>;
}

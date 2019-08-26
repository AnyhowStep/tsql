import {ColumnIdentifierRef} from "../../column-identifier-ref";
import {ColumnIdentifier} from "../../../column-identifier";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";
import {ColumnAlias} from "../query";

export type HasColumnIdentifier<
    RefT extends ColumnIdentifierRef,
    IdentifierT extends ColumnIdentifier
> = (
    keyof RefT extends never ?
    false :
    RefT extends ColumnIdentifierRef ?
    (
        IdentifierT extends ColumnIdentifier ?
        (
            //ColumnIdentifierRef extends ColumnIdentifierRefT ?
            string extends keyof RefT ?
            boolean :
            string extends IdentifierT["tableAlias"] ?
            (
                string extends IdentifierT["columnAlias"] ?
                boolean :
                IdentifierT["columnAlias"] extends ColumnAlias<RefT> ?
                boolean :
                false
            ) :
            IdentifierT["tableAlias"] extends keyof RefT ?
            (
                ColumnIdentifierMapUtil.HasColumnIdentifier<
                    RefT[IdentifierT["tableAlias"]],
                    IdentifierT
                >
            ) :
            false
        ) :
        never
    ) :
    never
);
export function hasColumnIdentifier<
    RefT extends ColumnIdentifierRef,
    IdentifierT extends ColumnIdentifier
> (ref : RefT, identifier : IdentifierT) : (
    HasColumnIdentifier<RefT, IdentifierT>
) {
    if (!Object.prototype.hasOwnProperty.call(ref, identifier.tableAlias)) {
        return false as any;
    }
    const columnMap = ref[identifier.tableAlias];
    return ColumnIdentifierMapUtil.hasColumnIdentifier(columnMap, identifier) as any;
}
export function assertHasColumnIdentifier (ref : ColumnIdentifierRef, identifier : ColumnIdentifier) {
    if (!hasColumnIdentifier(ref, identifier)) {
        throw new Error(`Column ${identifier.tableAlias}.${identifier.columnAlias} does not exist in column identifier ref`);
    }
}
export function assertHasColumnIdentifiers (ref : ColumnIdentifierRef, identifiers : ColumnIdentifier[]) {
    for (const identifier of identifiers) {
        assertHasColumnIdentifier(ref, identifier);
    }
}

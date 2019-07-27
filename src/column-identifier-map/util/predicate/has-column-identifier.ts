import {ColumnIdentifierMap} from "../../column-identifier-map";
import {ColumnIdentifier, ColumnIdentifierUtil} from "../../../column-identifier";

export type HasColumnIdentifier<
    ColumnMapT extends ColumnIdentifierMap,
    ColumnIdentifierT extends ColumnIdentifier
> = (
    keyof ColumnMapT extends never ?
    false :
    ColumnMapT extends ColumnIdentifierMap ?
    (
        ColumnIdentifierT extends ColumnIdentifier ?
        (
            //ColumnIdentifierMap extends ColumnMapT ?
            string extends keyof ColumnMapT ?
            boolean :
            ColumnIdentifier extends ColumnIdentifierT ?
            boolean :
            string extends ColumnIdentifierT["columnAlias"] ?
            (
                string extends ColumnIdentifierT["tableAlias"] ?
                boolean :
                ColumnIdentifierT["tableAlias"] extends ColumnIdentifierUtil.FromColumnIdentifierMap<ColumnMapT>["tableAlias"] ?
                boolean :
                false
            ) :
            ColumnIdentifierT["columnAlias"] extends keyof ColumnMapT ?
            (
                string extends ColumnIdentifierT["tableAlias"] ?
                boolean :
                ColumnIdentifierT["tableAlias"] extends ColumnMapT[ColumnIdentifierT["columnAlias"]]["tableAlias"] ?
                (
                    ColumnIdentifierT["columnAlias"] extends ColumnMapT[ColumnIdentifierT["columnAlias"]]["columnAlias"] ?
                    true :
                    false
                ) :
                false
            ) :
            false
        ) :
        never
    ) :
    never
);
export function hasColumnIdentifier<
    MapT extends ColumnIdentifierMap,
    IdentifierT extends ColumnIdentifier
> (map : MapT, identifier : IdentifierT) : (
    HasColumnIdentifier<MapT, IdentifierT>
) {
    const column = map[identifier.columnAlias];
    if (!ColumnIdentifierUtil.isColumnIdentifier(column)) {
        return false as HasColumnIdentifier<MapT, IdentifierT>;
    }
    return ColumnIdentifierUtil.isEqual(
        column,
        identifier
    ) as boolean as HasColumnIdentifier<MapT, IdentifierT>;
}
export function assertHasColumnIdentifier (map : ColumnIdentifierMap, identifier : ColumnIdentifier) {
    if (!hasColumnIdentifier(map, identifier)) {
        throw new Error(`Column ${identifier.tableAlias}.${identifier.columnAlias} does not exist in column identifier map`);
    }
}
export function assertHasColumnIdentifiers (map : ColumnIdentifierMap, identifiers : readonly ColumnIdentifier[]) {
    for (const columnIdentifier of identifiers) {
        assertHasColumnIdentifier(map, columnIdentifier);
    }
}

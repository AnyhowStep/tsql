import {ColumnIdentifierMap} from "../../column-identifier-map";

//Technically, this could be wrong.
//But it shouldn't be wrong, in general.
export type ColumnAlias<MapT extends ColumnIdentifierMap> = (
    MapT extends ColumnIdentifierMap ?
    Extract<keyof MapT, string> :
    never
);

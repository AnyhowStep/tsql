import {ColumnIdentifierMap} from "../../../column-identifier-map";

export type FromColumnIdentifierMap<ColumnMapT extends ColumnIdentifierMap> = (
    ColumnMapT extends ColumnIdentifierMap ?
    ColumnMapT[Extract<keyof ColumnMapT, string>] :
    never
);
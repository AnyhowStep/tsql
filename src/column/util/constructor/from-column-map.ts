import {ColumnMap} from "../../../column-map";

export type FromColumnMap<ColumnMapT extends ColumnMap> = (
    ColumnMapT extends ColumnMap ?
    ColumnMapT[Extract<keyof ColumnMapT, string>] :
    never
);
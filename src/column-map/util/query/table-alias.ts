import {ColumnMap} from "../../column-map";

export type TableAlias<ColumnMapT extends ColumnMap> = (
    ColumnMapT extends ColumnMap ?
    ColumnMapT[Extract<keyof ColumnMapT, string>]["tableAlias"] :
    never
);
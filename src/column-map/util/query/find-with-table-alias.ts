import {ColumnMap} from "../../column-map";

export type FindWithTableAlias<ColumnMapT extends ColumnMap, TableAliasT extends string> = (
    ColumnMapT extends ColumnMap ?
    Extract<
        ColumnMapT[Extract<keyof ColumnMapT, string>],
        { tableAlias : TableAliasT }
    > :
    never
);
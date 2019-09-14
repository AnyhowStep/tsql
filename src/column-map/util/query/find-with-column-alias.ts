import {ColumnMap} from "../../column-map";

/**
 * Used for unions of ColumnMap
 *
 * `(A|B)[columnAlias]` will likely give you unknown or similar
 */
export type FindWithColumnAlias<ColumnMapT extends ColumnMap, ColumnAliasT extends string> = (
    ColumnMapT extends ColumnMap ?
    (
        ColumnAliasT extends keyof ColumnMapT ?
        ColumnMapT[ColumnAliasT] :
        never
    ) :
    never
);

import {IAliasedTable} from "../../aliased-table";

/**
 * Given a union of `IAliasedTable`, it extracts the ones with the specified `TableAliasT`
 */
export type ExtractWithTableAlias<
    AliasedTableT extends IAliasedTable,
    TableAliasT extends string
> = (
    Extract<AliasedTableT, { tableAlias : TableAliasT }>
);

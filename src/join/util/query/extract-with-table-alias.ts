import {IJoin} from "../../join";

/**
 * Given a union of `IJoin`, it extracts the ones with the specified `TableAliasT`
 */
export type ExtractWithTableAlias<
    JoinT extends IJoin,
    TableAliasT extends string
> = (
    //Extract<JoinT, { tableAlias : TableAliasT }>
    JoinT extends IJoin ?
    (
        JoinT["tableAlias"] extends TableAliasT ?
        JoinT :
        never
    ) :
    never
);

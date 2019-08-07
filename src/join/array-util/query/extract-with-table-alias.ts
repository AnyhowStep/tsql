import {IJoin} from "../../join";
import * as JoinUtil from "../../util";

/**
 * Given an array of `IJoin`, it extracts the ones with the specified `TableAliasT`
 */
export type ExtractWithTableAlias<
    JoinsT extends readonly IJoin[],
    TableAliasT extends string
> = (
    JoinUtil.ExtractWithTableAlias<JoinsT[number], TableAliasT>
);

import {IJoin} from "../../join";
import * as JoinUtil from "../../util";

/**
 * Given an array of `IJoin`, it extracts the ones with the a primary key
 */
export type ExtractWithPrimaryKey<
    JoinsT extends readonly IJoin[]
> = (
    JoinUtil.ExtractWithPrimaryKey<JoinsT[number]>
);
export function extractWithPrimaryKey<
    JoinsT extends readonly IJoin[]
> (
    joins : JoinsT
) : (
    ExtractWithPrimaryKey<JoinsT>[]
) {
    return joins.filter(
        (join) : join is ExtractWithPrimaryKey<JoinsT> => (
            join.primaryKey != undefined
        )
    );
}

import {IJoin} from "../../join";
import * as JoinUtil from "../../util";

/**
 * Given a array of `IJoin`, it extracts the ones with at least one candidate key
 */
export type ExtractWithCandidateKey<
    JoinsT extends readonly IJoin[]
> = (
    JoinUtil.ExtractWithCandidateKey<JoinsT[number]>
);
export function extractWithCandidateKey<
    JoinsT extends readonly IJoin[]
> (
    joins : JoinsT
) : (
    ExtractWithCandidateKey<JoinsT>[]
) {
    return joins.filter(
        (join) : join is ExtractWithCandidateKey<JoinsT> => (
            join.candidateKeys.length > 0
        )
    );
}

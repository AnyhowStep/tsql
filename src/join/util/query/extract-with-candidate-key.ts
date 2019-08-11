import {IJoin} from "../../join";

/**
 * Given a union of `IJoin`, it extracts the ones with at least one candidate key
 */
export type ExtractWithCandidateKey<
    JoinT extends IJoin
> = (
    JoinT extends IJoin ?
    (
        JoinT["candidateKeys"][number] extends never ?
        never :
        JoinT
    ) :
    never
);

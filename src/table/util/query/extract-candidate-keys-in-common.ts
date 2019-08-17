import {ITable} from "../../table";
import {KeyArrayUtil} from "../../../key";

/**
 * Returns the candidate keys of `TableT`.
 * If `TableT` is a union, then it returns the candidate keys that may be found
 * in all elements.
 *
 * + Assumes `TableT` may be a union
 */
export type ExtractCandidateKeysInCommon<
    TableT extends Pick<ITable, "candidateKeys">
> = (
    KeyArrayUtil.ExtractKeysInCommon<TableT["candidateKeys"]>
);

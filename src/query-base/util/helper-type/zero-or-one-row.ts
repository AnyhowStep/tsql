import {OneRow} from "./one-row";
import {ZeroOrOneRowUsingLimit} from "./zero-or-one-row-using-limit";
import {ZeroOrOneRowUsingCompoundQueryLimit} from "./zero-or-one-row-using-union-limit";

export type ZeroOrOneRow = (
    | OneRow
    | ZeroOrOneRowUsingLimit
    | ZeroOrOneRowUsingCompoundQueryLimit
);

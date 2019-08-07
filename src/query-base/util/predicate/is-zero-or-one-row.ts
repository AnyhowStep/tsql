import {ZeroOrOneRow} from "../helper-type";
import {isOneRow} from "./is-one-row";
import {isZeroOrOneRowUsingLimit} from "./is-zero-or-one-row-using-limit";
import {isZeroOrOneRowUsingUnionLimit} from "./is-zero-or-one-row-using-union-limit";

export function isZeroOrOneRow (x : unknown) : x is ZeroOrOneRow {
    return (
        /**
         * This `OR` expression is sorted from most likely to least likely.
         * Do not change the order unless you have a good reason!
         */
        isZeroOrOneRowUsingLimit(x) ||
        isZeroOrOneRowUsingUnionLimit(x) ||
        isOneRow(x)
    );
}

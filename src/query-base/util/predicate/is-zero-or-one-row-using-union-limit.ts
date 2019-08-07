import {ZeroOrOneRowUsingUnionLimit} from "../helper-type";
import {isQuery} from "./is-query";

export function isZeroOrOneRowUsingUnionLimit (x : unknown) : x is ZeroOrOneRowUsingUnionLimit {
    return (
        isQuery(x) &&
        x.unionLimitClause != undefined &&
        (
            x.unionLimitClause.maxRowCount == 0 ||
            x.unionLimitClause.maxRowCount == 1 ||
            x.unionLimitClause.maxRowCount == BigInt(0) ||
            x.unionLimitClause.maxRowCount == BigInt(1)
        )
    );
}

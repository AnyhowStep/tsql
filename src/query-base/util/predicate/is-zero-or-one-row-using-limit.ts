import {ZeroOrOneRowUsingLimit} from "../helper-type";
import {isQuery} from "./is-query";

export function isZeroOrOneRowUsingLimit (x : unknown) : x is ZeroOrOneRowUsingLimit {
    return (
        isQuery(x) &&
        x.limitClause != undefined &&
        (
            x.limitClause.maxRowCount == BigInt(0) ||
            x.limitClause.maxRowCount == BigInt(1)
        ) &&
        x.unionClause == undefined &&
        x.unionLimitClause == undefined
    );
}

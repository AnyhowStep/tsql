import * as tm from "type-mapping";
import {ZeroOrOneRowUsingLimit} from "../helper-type";
import {isQuery} from "./is-query";

export function isZeroOrOneRowUsingLimit (x : unknown) : x is ZeroOrOneRowUsingLimit {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    return (
        isQuery(x) &&
        x.limitClause != undefined &&
        (
            tm.BigIntUtil.equal(x.limitClause.maxRowCount, BigInt(0)) ||
            tm.BigIntUtil.equal(x.limitClause.maxRowCount, BigInt(1))
        ) &&
        x.compoundQueryClause == undefined &&
        x.unionLimitClause == undefined
    );
}

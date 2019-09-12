import * as tm from "type-mapping";
import {ZeroOrOneRowUsingCompoundQueryLimit} from "../helper-type";
import {isQuery} from "./is-query";

export function isZeroOrOneRowUsingCompoundQueryLimit (x : unknown) : x is ZeroOrOneRowUsingCompoundQueryLimit {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    return (
        isQuery(x) &&
        x.compoundQueryLimitClause != undefined &&
        (
            tm.BigIntUtil.equal(x.compoundQueryLimitClause.maxRowCount, BigInt(0)) ||
            tm.BigIntUtil.equal(x.compoundQueryLimitClause.maxRowCount, BigInt(1))
        )
    );
}

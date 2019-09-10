import * as tm from "type-mapping";
import {ZeroOrOneRowUsingUnionLimit} from "../helper-type";
import {isQuery} from "./is-query";

export function isZeroOrOneRowUsingUnionLimit (x : unknown) : x is ZeroOrOneRowUsingUnionLimit {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    return (
        isQuery(x) &&
        x.unionLimitClause != undefined &&
        (
            tm.BigIntUtil.equal(x.unionLimitClause.maxRowCount, BigInt(0)) ||
            tm.BigIntUtil.equal(x.unionLimitClause.maxRowCount, BigInt(1))
        )
    );
}

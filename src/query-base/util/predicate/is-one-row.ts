import {OneRow} from "../helper-type";
import {isQuery} from "./is-query";
import {FromClauseUtil} from "../../../from-clause";

export function isOneRow (x : unknown) : x is OneRow {
    return (
        isQuery(x) &&
        FromClauseUtil.isBeforeFromClause(x.fromClause) &&
        x.unionClause == undefined
    );
}

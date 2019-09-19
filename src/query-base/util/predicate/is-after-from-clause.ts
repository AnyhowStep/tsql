import {AfterFromClause} from "../helper-type";
import {isQuery} from "./is-query";
import {FromClauseUtil} from "../../../from-clause";

export function isAfterFromClause (x : unknown) : x is AfterFromClause {
    return isQuery(x) && FromClauseUtil.isAfterFromClause(x.fromClause);
}

import {BeforeSelectClause} from "../helper-type";
import {isQuery} from "./is-query";

export function isBeforeSelectClause (x : unknown) : x is BeforeSelectClause {
    return isQuery(x) && (x.selectClause == undefined);
}

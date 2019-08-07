import {AfterSelectClause} from "../helper-type";
import {isQuery} from "./is-query";

export function isAfterSelectClause (x : unknown) : x is AfterSelectClause {
    return isQuery(x) && (x.selectClause != undefined);
}

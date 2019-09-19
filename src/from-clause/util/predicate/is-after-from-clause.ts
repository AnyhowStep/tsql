import {AfterFromClause} from "../helper-type";
import {isFromClause} from "./is-from-clause";

export function isAfterFromClause (x : unknown) : x is AfterFromClause {
    return isFromClause(x) && (x.currentJoins != undefined);
}

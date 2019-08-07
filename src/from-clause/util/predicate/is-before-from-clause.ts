import {BeforeFromClause} from "../helper-type";
import {isFromClause} from "./is-from-clause";

export function isBeforeFromClause (x : unknown) : x is BeforeFromClause {
    return isFromClause(x) && (x.currentJoins == undefined);
}

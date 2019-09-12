import {BeforeCompoundQueryClause} from "../helper-type";
import {isQuery} from "./is-query";

export function isBeforeCompoundQueryClause (x : unknown) : x is BeforeCompoundQueryClause {
    return isQuery(x) && (x.compoundQueryClause == undefined);
}

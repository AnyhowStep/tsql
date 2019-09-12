import {BeforeUnionClause} from "../helper-type";
import {isQuery} from "./is-query";

export function isBeforeUnionClause (x : unknown) : x is BeforeUnionClause {
    return isQuery(x) && (x.compoundQueryClause == undefined);
}

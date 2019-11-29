import {QueryBaseUtil} from "../../../query-base";
import {AnySubqueryExpr} from "../../built-in-expr";

export function isAnySubqueryExpr (x : unknown) : x is AnySubqueryExpr {
    return QueryBaseUtil.isOneSelectItem(x) && QueryBaseUtil.isZeroOrOneRow(x);
}

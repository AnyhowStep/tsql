import {QueryBaseUtil} from "../../../query-base";
import {AnySubqueryExpr} from "../../raw-expr";

export function isAnySubqueryExpr (x : unknown) : x is AnySubqueryExpr {
    return QueryBaseUtil.isOneSelectItem(x) && QueryBaseUtil.isZeroOrOneRow(x);
}

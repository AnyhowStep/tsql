import {AnyNonPrimitiveRawExpr} from "../../raw-expr";
import {PrimitiveExprUtil} from "../../../primitive-expr";
import {ExprUtil} from "../../../expr";
import {ColumnUtil} from "../../../column";
import {QueryBaseUtil} from "../../../query-base";
import {ExprSelectItemUtil} from "../../../expr-select-item";

export function isAnyNonPrimitiveRawExpr (mixed : unknown) : mixed is AnyNonPrimitiveRawExpr {
    if (PrimitiveExprUtil.isPrimitiveExpr(mixed)) {
        return false;
    }
    if (ExprUtil.isExpr(mixed)) {
        return true;
    }

    if (ColumnUtil.isColumn(mixed)) {
        return true;
    }

    if (QueryBaseUtil.isOneSelectItem(mixed)) {
        return true;
    }

    if (ExprSelectItemUtil.isExprSelectItem(mixed)) {
        return true;
    }

    return false;
}

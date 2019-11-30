import {AnyNonValueExpr} from "../../built-in-expr";
import {BuiltInValueExprUtil} from "../../../built-in-value-expr";
import {ExprUtil} from "../../../expr";
import {ColumnUtil} from "../../../column";
import {QueryBaseUtil} from "../../../query-base";
import {ExprSelectItemUtil} from "../../../expr-select-item";

export function isAnyNonValueExpr (mixed : unknown) : mixed is AnyNonValueExpr {
    if (BuiltInValueExprUtil.isBuiltInValueExpr(mixed)) {
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

import {SortExpr} from "../../order";
import {ColumnUtil} from "../../../column";
import {ExprUtil} from "../../../expr";
import {ExprSelectItemUtil} from "../../../expr-select-item";

export function isSortExpr (mixed : unknown) : mixed is SortExpr {
    return (
        ColumnUtil.isColumn(mixed) ||
        ExprUtil.isExpr(mixed) ||
        ExprSelectItemUtil.isExprSelectItem(mixed)
    );
}

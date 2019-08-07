import {SingleValueSelectItem} from "../../select-item";
import {ColumnUtil} from "../../../column";
import {ExprSelectItemUtil} from "../../../expr-select-item";

export function isSingleValueSelectItem (x : unknown) : x is SingleValueSelectItem {
    return (
        ColumnUtil.isColumn(x) ||
        ExprSelectItemUtil.isExprSelectItem(x)
    );
}

import {OneSelectItem} from "../helper-type";
import {isAfterSelectClause} from "./is-after-select-clause";
import {SelectItemUtil} from "../../../select-item";

export function isOneSelectItem (x : unknown) : x is OneSelectItem<unknown> {
    return (
        isAfterSelectClause(x) &&
        x.selectClause.length == 1 &&
        SelectItemUtil.isSingleValueSelectItem(x.selectClause[0])
    );
}

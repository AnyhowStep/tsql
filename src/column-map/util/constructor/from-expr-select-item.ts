import {IExprSelectItem} from "../../../expr-select-item";
import {FromColumn, fromColumn} from "./from-column";
import {ColumnUtil} from "../../../column";

export type FromExprSelectItem<ItemT extends IExprSelectItem> =
    FromColumn<ColumnUtil.FromExprSelectItem<ItemT>>
;

export function fromExprSelectItem<
    ItemT extends IExprSelectItem
> (
    item : ItemT
) : (
    FromExprSelectItem<ItemT>
) {
    return fromColumn(ColumnUtil.fromExprSelectItem(item));
}

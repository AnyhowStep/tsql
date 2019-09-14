import {SelectItem} from "../../../select-item";
import {IColumn} from "../../../column/column";
import {FromColumn, fromColumn} from "./from-column";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {ColumnMap} from "../../column-map";
import {ColumnRef, ColumnRefUtil} from "../../../column-ref";
import {FromExprSelectItem, fromExprSelectItem} from "./from-expr-select-item";
import {FromColumnRef, fromColumnRef} from "./from-column-ref";
import {ColumnUtil} from "../../../column";
import {isColumnMap} from "../predicate";

export type FromSelectItem<ItemT extends SelectItem> =
    ItemT extends IColumn ?
    FromColumn<ItemT> :
    ItemT extends IExprSelectItem ?
    FromExprSelectItem<ItemT> :
    ItemT extends ColumnMap ?
    ItemT :
    ItemT extends ColumnRef ?
    FromColumnRef<ItemT> :
    never
;

export function fromSelectItem<ItemT extends SelectItem> (
    item : ItemT
) : FromSelectItem<ItemT> {
    if (ColumnUtil.isColumn(item)) {
        return fromColumn(item) as ColumnMap as FromSelectItem<ItemT>;
    } else if (ExprSelectItemUtil.isExprSelectItem(item)) {
        return fromExprSelectItem(item) as ColumnMap as FromSelectItem<ItemT>;
    } else if (isColumnMap(item)) {
        return item as FromSelectItem<ItemT>;
    } else if (ColumnRefUtil.isColumnRef(item)) {
        return fromColumnRef(item) as ColumnMap as FromSelectItem<ItemT>;
    } else {
        throw new Error(`Unknown select item`);
    }
}

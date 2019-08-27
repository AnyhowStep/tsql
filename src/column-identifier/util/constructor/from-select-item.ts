import {SelectItem} from "../../../select-item";
import {IColumn} from "../../../column/column";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {FromExprSelectItem, fromExprSelectItem} from "./from-expr-select-item";
import {FromColumn, fromColumn} from "./from-column";
import {ColumnRef, ColumnRefUtil} from "../../../column-ref";
import {FromColumnRef, fromColumnRef} from "./from-column-ref";
import {ColumnMap, ColumnMapUtil} from "../../../column-map";
import {FromColumnMap, fromColumnMap} from "./from-column-map";
import {ColumnIdentifier} from "../../column-identifier";
import {ColumnUtil} from "../../../column";

/**
 * + Assumes `SelectItemT` may be union
 */
export type FromSelectItem<SelectItemT extends SelectItem> = (
    /**
     * Ordered from most likely to least likely
     */
    SelectItemT extends IExprSelectItem ?
    FromExprSelectItem<SelectItemT> :
    SelectItemT extends ColumnMap ?
    FromColumnMap<SelectItemT> :
    SelectItemT extends ColumnRef ?
    FromColumnRef<SelectItemT> :
    SelectItemT extends IColumn ?
    FromColumn<SelectItemT> :
    never
);
export function fromSelectItem<SelectItemT extends SelectItem> (
    selectItem : SelectItemT
) : (
    FromSelectItem<SelectItemT>[]
) {
    if (ExprSelectItemUtil.isExprSelectItem(selectItem)) {
        return [fromExprSelectItem(selectItem)] as ColumnIdentifier[] as FromSelectItem<SelectItemT>[];
    } else if (ColumnUtil.isColumn(selectItem)) {
        return [fromColumn(selectItem)] as ColumnIdentifier[] as FromSelectItem<SelectItemT>[];
    } else if (ColumnMapUtil.isColumnMap(selectItem)) {
        return fromColumnMap(selectItem) as ColumnIdentifier[] as FromSelectItem<SelectItemT>[];
    } else if (ColumnRefUtil.isColumnRef(selectItem)) {
        return fromColumnRef(selectItem) as ColumnIdentifier[] as FromSelectItem<SelectItemT>[];
    } else {
        throw new Error(`Unknown SelectItem`);
    }
}

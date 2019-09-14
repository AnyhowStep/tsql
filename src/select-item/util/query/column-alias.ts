import {SelectItem} from "../../select-item";
import {IColumn, ColumnUtil} from "../../../column";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {ColumnMap, ColumnMapUtil} from "../../../column-map";
import {ColumnRef, ColumnRefUtil} from "../../../column-ref";

export type ColumnAlias<ItemT extends SelectItem> =
    ItemT extends IColumn ?
    ItemT["columnAlias"] :
    ItemT extends IExprSelectItem ?
    ItemT["alias"] :
    ItemT extends ColumnMap ?
    ColumnMapUtil.ColumnAlias<ItemT> :
    ItemT extends ColumnRef ?
    ColumnRefUtil.ColumnAlias<ItemT> :
    never
;

export function columnAlias (item : SelectItem) : string[] {
    if (ColumnUtil.isColumn(item)) {
        return [item.columnAlias];
    } else if (ExprSelectItemUtil.isExprSelectItem(item)) {
        return [item.alias];
    } else if (ColumnMapUtil.isColumnMap(item)) {
        return ColumnMapUtil.columnAlias(item);
    } else if (ColumnRefUtil.isColumnRef(item)) {
        return ColumnRefUtil.columnAlias(item);
    } else {
        throw new Error("Unknown select item");
    }
}

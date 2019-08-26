import {SelectItem} from "../../../select-item";
import {IColumn} from "../../../column/column";
import {IExprSelectItem} from "../../../expr-select-item";
import {FromExprSelectItem} from "./from-expr-select-item";
import {FromColumn} from "./from-column";
import {ColumnRef} from "../../../column-ref";
import {FromColumnRef} from "./from-column-ref";
import {ColumnMap} from "../../../column-map";
import {FromColumnMap} from "./from-column-map";

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

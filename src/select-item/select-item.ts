import {IColumn, IAnonymousColumn} from "../column";
import {ColumnMap} from "../column-map";
import {IExprSelectItem, IAnonymousExprSelectItem} from "../expr-select-item";
import {ColumnRef} from "../column-ref";

export type SingleValueSelectItem = (
    IColumn |
    IExprSelectItem
);

export type AnonymousTypedSingleValueSelectItem<TypeT> = (
    IAnonymousColumn<TypeT> |
    IAnonymousExprSelectItem<TypeT>
);

export type SelectItem = (
    SingleValueSelectItem |
    ColumnMap |
    ColumnRef
);

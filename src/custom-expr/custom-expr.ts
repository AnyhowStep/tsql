
import * as tm from "type-mapping";
import {IExpr} from "../expr";
import {ColumnUtil} from "../column";
import {IExprSelectItem} from "../expr-select-item";
import {UsedRefUtil} from "../used-ref";
import {ColumnMap} from "../column-map";
import {NonValueExpr_NonCorrelated} from "../built-in-expr";

export type CustomExpr_NonCorrelated<TypeT> =
    | TypeT
    | NonValueExpr_NonCorrelated<TypeT>
;

/**
 * We don't support subqueries because it's too complicated
 * to check their `IUsedRef`... For now.
 */
export type CustomExpr_MapCorrelated<
    ColumnMapT extends ColumnMap,
    TypeT
> =
    | TypeT
    | IExpr<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : UsedRefUtil.FromColumnMap<ColumnMapT>,
    }>
    | ColumnUtil.FromColumnMap<ColumnMapT>
    | IExprSelectItem<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : UsedRefUtil.FromColumnMap<ColumnMapT>,
        tableAlias : string,
        alias : string,
    }>
;

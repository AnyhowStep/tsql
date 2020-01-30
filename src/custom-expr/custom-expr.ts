
import * as tm from "type-mapping";
import {IExpr} from "../expr";
import {ColumnUtil} from "../column";
import {IExprSelectItem} from "../expr-select-item";
import {UsedRefUtil} from "../used-ref";
import {ColumnMap} from "../column-map";
import {NonValueExpr_NonCorrelated, NonValueExpr_NonCorrelated_NonAggregate} from "../built-in-expr";

export type CustomExpr_NonCorrelated<TypeT> =
    | TypeT
    | NonValueExpr_NonCorrelated<TypeT>
;

/**
 * Workaround,
 * https://github.com/microsoft/TypeScript/issues/35616#issuecomment-564894944
 */
export type CustomExpr_NonCorrelatedOrUndefined<TypeT> =
    | CustomExpr_NonCorrelated<TypeT>
    | undefined
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
        isAggregate : boolean,
    }>
    | ColumnUtil.FromColumnMap<ColumnMapT>
    | IExprSelectItem<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : UsedRefUtil.FromColumnMap<ColumnMapT>,
        tableAlias : string,
        alias : string,
        isAggregate : boolean,
    }>
;

/**
 * Workaround,
 * https://github.com/microsoft/TypeScript/issues/35616#issuecomment-564894944
 *
 * We don't support subqueries because it's too complicated
 * to check their `IUsedRef`... For now.
 */
export type CustomExpr_MapCorrelatedOrUndefined<
    ColumnMapT extends ColumnMap,
    TypeT
> =
    | CustomExpr_MapCorrelated<ColumnMapT, TypeT>
    | undefined
;

/**
 * @todo Better name
 */
export type CustomExpr_NonCorrelated_NonAggregate<TypeT> =
    | TypeT
    | NonValueExpr_NonCorrelated_NonAggregate<TypeT>
;

/**
 * @todo Better name
 */
/**
 * Workaround,
 * https://github.com/microsoft/TypeScript/issues/35616#issuecomment-564894944
 */
export type CustomExpr_NonCorrelated_NonAggregateOrUndefined<TypeT> =
    | CustomExpr_NonCorrelated_NonAggregate<TypeT>
    | undefined
;


/**
 * @todo Better name
 */
export type CustomExpr_MapCorrelated_NonAggregate<
    ColumnMapT extends ColumnMap,
    TypeT
> =
    | TypeT
    | IExpr<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : UsedRefUtil.FromColumnMap<ColumnMapT>,
        isAggregate : false,
    }>
    | ColumnUtil.FromColumnMap<ColumnMapT>
    | IExprSelectItem<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : UsedRefUtil.FromColumnMap<ColumnMapT>,
        tableAlias : string,
        alias : string,
        isAggregate : false,
    }>
;

/**
 * @todo Better name
 */
export type CustomExpr_MapCorrelated_NonAggregateOrUndefined<
    ColumnMapT extends ColumnMap,
    TypeT
> =
    | CustomExpr_MapCorrelated_NonAggregate<ColumnMapT, TypeT>
    | undefined
;

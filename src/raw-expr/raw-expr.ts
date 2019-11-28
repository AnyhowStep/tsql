/**
 * Types of expressions,
 * + `BuiltInValueExpr`
 *   + Called a "value" expr because it's just values like `-3.141, new Date(), 34n, "hello", Buffer.from("hi"), etc.`
 *   + Called a "built-in" expr because they use **JavaScript's** built-in types to represent **SQL's** built-in types,
 *     `bigint|number|string|boolean|Date|Uint8Array|null`
 *   + `Uint8Array` is not a "primitive" type; it is a "built-in" type.
 *
 * + `IExpr`
 *   + An arbitrary expression that may contain operators, function calls, subqueries, values, etc.
 *
 * + `IColumn`
 *   + A column belonging to a table/view/derived table
 *
 * + `OneSelectItem & ZeroOrOneRow`
 *   + A scalar subquery returning zero or one rows
 *
 * + `OneSelectItem & OneRow`
 *   + A scalar subquery returning one row
 *
 * + `IExprSelectItem`
 *   + A **named** `IExpr`
 *
 * + `CustomValueExpr` (Basically `Exclude<unknown, AllOfTheAboveTypes>`, or `not AllOfTheAboveTypes`)
 *   + Called a "value" expr because it's just values like `{ x:4, y:5.6 }, [1,2,3], etc.`
 *   + Called a "custom" expr because they use custom data types to represent.
 *     + Some of **SQL's** built-in types require **custom JavaScript** types to represent.
 *       + `DECIMAL(precision, scale)`
 *       + `BIGINT UNSIGNED` (MySQL)
 *       + Spatial types (MySQL, PostgreSQL)
 *   + Mostly used by `UPDATE` and `INSERT` statements for tables becase they require an `IDataType`
 *     to work properly. An `IDataType` is usually only found in table columns.
 *
 * -----
 *
 * Categorizations of expressions,
 * + `AnyValueExpr`
 *   + Either a `BuiltInValueExpr` or `CustomValueExpr`
 *
 * + `AnyBuiltInExpr` (Originally `AnyRawExpr`)
 *   + Any kind of expression, except `CustomValueExpr`
 *   + Used for stuff like `.fetchValue()`
 *     + We wouldn't know how to handle `.fetchValue(() => { return { x:1, y:2 }; })`
 *
 * + `BuiltInExpr<TypeT>` (Orignally `RawExpr<TypeT>`)
 *   + A raw expression that was originally not meant to have `CustomValueExpr`.
 *   + Mainly used for composing expressions
 *   + Used for stuff like `tsql.decimal.sum()`
 *     + We wouldn't know how to handle `tsql.decimal.sum(myDecimalType)`
 *     + `myDecimalType` might be a `string`
 *   + We might be able to get rid of some usages of this type
 *     if we force `IExpr` factories to take an `IDataType` for each argument
 *   + Cannot get rid of usages like `if(condition, then, else)` because the `then` and `else`
 *     arguments may be completely arbitrary.
 *
 * + `AnySubqueryExpr`
 *   + Helper type for `AnyNonCustomValueRawExpr`/`AnyRawExpr`
 *
 * + `AnyNonValueExpr` (Originally `AnyNonPrimitiveRawExpr`)
 *   + `IExpr|IColumn|IExprSelectItem|AnySubqueryExpr`
 *
 * + `NonValueExpr_NonCorrelated<TypeT>` (Originally `NonPrimitiveRawExprNoUsedRef<TypeT>`)
 *   + Used for `INSERT` statements
 *
 * + `AnyBuiltInExpr_NonCorrelated` (Originally `AnyRawExprNoUsedRef`)
 *   + Not used at the moment, delete?
 *
 * + `BuiltInExpr_NonCorrelated<TypeT>` (Originally `RawExprNoUsedRef_Output<TypeT>`)
 *   + Used for `INSERT` statements; at output positions
 *   + Does not allow `CustomValueExpr`
 *
 * + `RawExpr_NonCorrelated<TypeT>` (Originally `RawExprNoUsedRef_Input<TypeT>`)
 *   + Used for `INSERT` statements; at input positions
 *   + Allows `CustomValueExpr`, requires `IDataType` to handle correctly
 *
 * + `BuiltInExpr_MapCorrelated<TypeT, ColumnMapT>` (Originally `RawExprUsingColumnMap_Output<ColumnMapT, TypeT>`)
 *   + Used for `UPDATE` statements; at output positions
 *   + Does not allow `CustomValueExpr`
 *
 * + `RawExpr_MapCorrelated<TypeT, ColumnMapT>` (Originally `RawExprUsingColumnMap_Input<ColumnMapT, TypeT>`)
 *   + Used for `UPDATE` statements; at input positions
 *   + Allows `CustomValueExpr`, requires `IDataType` to handle correctly
 */
import * as tm from "type-mapping";
import {BuiltInValueExpr} from "../built-in-value-expr";
import {IAnonymousExpr, IExpr} from "../expr";
import {IAnonymousColumn, IColumn, ColumnUtil} from "../column";
import {IAnonymousExprSelectItem, IExprSelectItem} from "../expr-select-item";
import {QueryBaseUtil} from "../query-base";
import {IUsedRef, UsedRefUtil} from "../used-ref";
import {ColumnMap} from "../column-map";

export type RawExpr<TypeT> = (
    | (
        TypeT extends BuiltInValueExpr ?
        TypeT :
        never
    )
    | IAnonymousExpr<TypeT>
    | IAnonymousColumn<TypeT>
    | (
        null extends TypeT ?
        (QueryBaseUtil.OneSelectItem<TypeT> & QueryBaseUtil.ZeroOrOneRow) :
        (QueryBaseUtil.OneSelectItem<TypeT> & QueryBaseUtil.OneRow)
    )
    | IAnonymousExprSelectItem<TypeT>
);

export type AnySubqueryExpr = (QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.ZeroOrOneRow);
export type AnyBuiltInExpr = (
    | BuiltInValueExpr
    | IExpr
    | IColumn
    | AnySubqueryExpr
    | IExprSelectItem
);

export type AnyNonValueExpr =
    | IExpr
    | IColumn
    | AnySubqueryExpr
    | IExprSelectItem
;

export type NonValueExpr_NonCorrelated<TypeT> =
    | IExpr<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : IUsedRef<{}>,
    }>
    /**
     * A `column` is itself a used ref, and is not allowed
     */
    //| IAnonymousColumn<TypeT>
    | (
        null extends TypeT ?
        (QueryBaseUtil.OneSelectItem<TypeT> & QueryBaseUtil.ZeroOrOneRow & QueryBaseUtil.NonCorrelated) :
        (QueryBaseUtil.OneSelectItem<TypeT> & QueryBaseUtil.OneRow & QueryBaseUtil.NonCorrelated)
    )
    | IExprSelectItem<{
        mapper : tm.SafeMapper<TypeT>,

        tableAlias : string,
        alias : string,

        usedRef : IUsedRef<{}>,
    }>
;
export type AnyRawExprNoUsedRef =
    | BuiltInValueExpr
    | NonValueExpr_NonCorrelated<any>
;

/**
 * Custom data types **not** allowed
 */
export type RawExprNoUsedRef_Output<TypeT> =
    | (
        TypeT extends BuiltInValueExpr ?
        TypeT :
        never
    )
    | NonValueExpr_NonCorrelated<TypeT>
;

/**
 * Custom data types allowed
 */
export type RawExprNoUsedRef_Input<TypeT> =
    | TypeT
    | NonValueExpr_NonCorrelated<TypeT>
;

/**
 * We don't support subqueries because it's too complicated
 * to check their `IUsedRef`
 *
 * Allows custom data types
 */
export type RawExprUsingColumnMap_Input<
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

/**
 * We don't support subqueries because it's too complicated
 * to check their `IUsedRef`
 *
 * Does not allow custom data types
 */
export type RawExprUsingColumnMap_Output<
    ColumnMapT extends ColumnMap,
    TypeT
> =
    | Extract<TypeT, BuiltInValueExpr>
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

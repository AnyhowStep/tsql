import * as tm from "type-mapping";
import {IColumn, ColumnUtil} from "../../column";
import {BuiltInExpr, BuiltInExprUtil, AnyBuiltInExpr} from "../../built-in-expr";
import {Expr} from "../../expr/expr-impl";
import {isNull} from "../null-safe-equation";
import {AssertNonUnion, BaseType} from "../../type-util";
import {UsedRefUtil} from "../../used-ref";
import * as ifImpl from "./if";

/**
 * A special compile-time type-narrowing function.
 *
 * Narrows a column from `T|null` to `T` in the else-branch.
 *
 * Translated to SQL, we get,
 * ```sql
 *  IF(
 *      myColumn IS NULL,
 *      thenExpr,
 *      -- The `elseExpr` is free to use `myColumn` as a non-nullable column
 *      -- because we know `myColumn` is NOT NULL in the else-branch.
 *      elseExpr
 *  )
 * ```
 *
 *
 * @param column - The column to narrow from `T|null` to `T`
 * @param then - The result of the expression, if the `column` is `null`
 * @param elseDelegate - The result of the expression, if the `column` is `T`
 */
export function ifIsNull<
    ColumnT extends IColumn,
    ThenT extends AnyBuiltInExpr,
    ElseT extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<ThenT>>|null>
>(
    column : ColumnT & AssertNonUnion<ColumnT>,
    then : ThenT,
    elseDelegate : (narrowedColumns : {
        [columnAlias in ColumnT["columnAlias"]] : ColumnUtil.ToNonNullable<ColumnT>
    }) => ElseT
) : (
    Expr<{
        mapper : tm.SafeMapper<BuiltInExprUtil.TypeOf<ThenT|ElseT>>,
        usedRef : (
            UsedRefUtil.IntersectTryReuseExistingType<
                | BuiltInExprUtil.UsedRef<ThenT>
                | UsedRefUtil.WithValue<
                    BuiltInExprUtil.IntersectUsedRef<
                        | ColumnT
                        | ElseT
                    >,
                    ColumnT["tableAlias"],
                    ColumnT["columnAlias"],
                    tm.OutputOf<ColumnT["mapper"]>
                >
            >
        ),
        isAggregate : BuiltInExprUtil.IsAggregate<ColumnT|ThenT|ElseT>,
    }>
) {
    return ifImpl.if(
        isNull(column),
        then,
        elseDelegate(
            {
                [column.columnAlias] : ColumnUtil.toNonNullable<ColumnT>(column)
            } as (
                {
                    [columnAlias in ColumnT["columnAlias"]] : ColumnUtil.ToNonNullable<ColumnT>
                }
            )
        ) as any
    ) as (
        Expr<{
            mapper : tm.SafeMapper<BuiltInExprUtil.TypeOf<ThenT|ElseT>>,
            usedRef : (
                UsedRefUtil.IntersectTryReuseExistingType<
                    | BuiltInExprUtil.UsedRef<ThenT>
                    | UsedRefUtil.WithValue<
                        BuiltInExprUtil.IntersectUsedRef<
                            | ColumnT
                            | ElseT
                        >,
                        ColumnT["tableAlias"],
                        ColumnT["columnAlias"],
                        tm.OutputOf<ColumnT["mapper"]>
                    >
                >
            ),
            isAggregate : BuiltInExprUtil.IsAggregate<ColumnT|ThenT|ElseT>,
        }>
    );
}

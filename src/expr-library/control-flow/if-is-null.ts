import * as tm from "type-mapping";
import {IColumn, ColumnUtil} from "../../column";
import {BuiltInExpr, BuiltInExprUtil, AnyBuiltInExpr} from "../../built-in-expr";
import {Expr} from "../../expr/expr-impl";
import {isNull} from "../null-safe-equation";
import {AssertNonUnion, BaseType} from "../../type-util";
import {UsedRefUtil} from "../../used-ref";
import * as ifImpl from "./if";

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
        isAggregate : BuiltInExprUtil.IsAggregate<ThenT|ElseT>,
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
            isAggregate : BuiltInExprUtil.IsAggregate<ThenT|ElseT>,
        }>
    );
}

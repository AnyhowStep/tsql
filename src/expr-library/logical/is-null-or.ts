import * as tm from "type-mapping";
import {IColumn, ColumnUtil} from "../../column";
import {BuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {Expr} from "../../expr/expr-impl";
import {isNull} from "../null-safe-equation";
import {or} from "./or";
import {AssertNonUnion} from "../../type-util";
import {UsedRefUtil} from "../../used-ref";

export function isNullOr<
    ColumnT extends IColumn,
    BuiltInExprT extends BuiltInExpr<boolean>
>(
    column : ColumnT & AssertNonUnion<ColumnT>,
    builtInExprDelegate : (narrowedColumns : {
        [columnAlias in ColumnT["columnAlias"]] : ColumnUtil.ToNonNullable<ColumnT>
    }) => BuiltInExprT
) : (
    Expr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : (
            UsedRefUtil.WithValue<
                BuiltInExprUtil.IntersectUsedRef<
                    | ColumnT
                    | BuiltInExprT
                >,
                ColumnT["tableAlias"],
                ColumnT["columnAlias"],
                tm.OutputOf<ColumnT["mapper"]>
            >
        ),
        isAggregate : BuiltInExprUtil.IsAggregate<BuiltInExprT>,
    }>
) {
    return or(
        isNull(column),
        builtInExprDelegate(
            {
                [column.columnAlias] : ColumnUtil.toNonNullable<ColumnT>(column)
            } as (
                {
                    [columnAlias in ColumnT["columnAlias"]] : ColumnUtil.ToNonNullable<ColumnT>
                }
            )
        )
    ) as (
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : (
                UsedRefUtil.WithValue<
                    BuiltInExprUtil.IntersectUsedRef<
                        | ColumnT
                        | BuiltInExprT
                    >,
                    ColumnT["tableAlias"],
                    ColumnT["columnAlias"],
                    tm.OutputOf<ColumnT["mapper"]>
                >
            ),
            isAggregate : BuiltInExprUtil.IsAggregate<BuiltInExprT>,
        }>
    );
}

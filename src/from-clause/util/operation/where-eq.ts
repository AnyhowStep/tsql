import * as tm from "type-mapping";
import {IFromClause} from "../../from-clause";
import {ColumnUtil} from "../../../column";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {PrimitiveExprUtil, NonNullPrimitiveExpr} from "../../../primitive-expr";
import {RawExprUtil} from "../../../raw-expr";
import {eq} from "../../../expr-library";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqImpl<
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<CurrentJoinsT>,
        NonNullPrimitiveExpr
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>,
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"],
> = (
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : JoinArrayUtil.ReplaceColumn<
            CurrentJoinsT,
            ColumnT["tableAlias"],
            ColumnT["columnAlias"],
            PrimitiveExprUtil.CaseInsensitiveNarrow<
                tm.OutputOf<ColumnT["mapper"]>,
                ValueT
            >
        >
    }>
);
export type WhereEq<
    FromClauseT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>,
        NonNullPrimitiveExpr
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>
> = (
    WhereEqImpl<
        ColumnT,
        ValueT,
        FromClauseT["outerQueryJoins"],
        FromClauseT["currentJoins"]
    >
);
/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqDelegateImpl<
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<CurrentJoinsT>,
        NonNullPrimitiveExpr
    >,
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> = (
    (
        columns : (
            ColumnRefUtil.TryFlatten<
                ColumnRefUtil.ExtractWithType<
                    ColumnRefUtil.FromColumnArray<
                        ColumnUtil.FromJoinArray<CurrentJoinsT>[]
                    >,
                    NonNullPrimitiveExpr
                >
            >
        )
    ) => ColumnT
);
export type WhereEqDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>,
        NonNullPrimitiveExpr
    >
> = (
    WhereEqDelegateImpl<
        ColumnT,
        FromClauseT["currentJoins"]
    >
);
/**
 * Narrows a column's type based on equality to a value
 *
 * Given the below expression,
 * ```sql
 *  SELECT
 *      myTable.myColumn
 *  FROM
 *      myTable
 *  WHERE
 *      myTable.myColumn = 1
 * ```
 *
 * We know, without even executing the query,
 * that the type of `myTable.myColumn` for all rows
 * in the result set will be `1`.
 */
export function whereEq<
    FromClauseT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>,
        NonNullPrimitiveExpr
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    whereEqDelegate : WhereEqDelegate<FromClauseT, ColumnT>,
    value : ValueT
) : (
    {
        fromClause : WhereEq<FromClauseT, ColumnT, ValueT>,
        whereClause : WhereClause,
    }
) {
    const columns = ColumnRefUtil.__noOp_extractWithType<NonNullPrimitiveExpr>()(
        ColumnRefUtil.fromColumnArray(
            ColumnUtil.fromJoinArray<FromClauseT["currentJoins"]>(fromClause.currentJoins)
        )
    );
    const column = whereEqDelegate(
        ColumnRefUtil.tryFlatten(columns)
    );

    ColumnIdentifierRefUtil.assertHasColumnIdentifier(
        columns,
        column
    );

    const result : (
        {
            fromClause : WhereEq<FromClauseT, ColumnT, ValueT>,
            whereClause : WhereClause,
        }
    ) = {
        fromClause : {
            outerQueryJoins : fromClause.outerQueryJoins,
            currentJoins : JoinArrayUtil.replaceColumn<
                FromClauseT["currentJoins"],
                ColumnT["tableAlias"],
                ColumnT["columnAlias"],
                PrimitiveExprUtil.CaseInsensitiveNarrow<
                    tm.OutputOf<ColumnT["mapper"]>,
                    ValueT
                >
            >(
                fromClause.currentJoins,
                column.tableAlias,
                column.columnAlias,
                /**
                 * Cast to the type of `ValueT`
                 */
                tm.or(
                    RawExprUtil.mapper(value),
                    tm.pipe(
                        column.mapper,
                        RawExprUtil.mapper(value)
                    )
                ) as (
                    () => PrimitiveExprUtil.CaseInsensitiveNarrow<
                        tm.OutputOf<ColumnT["mapper"]>,
                        ValueT
                    >
                )
            ),
        },
        whereClause : WhereClauseUtil.where<FromClauseT>(
            fromClause,
            whereClause,
            /**
             * @todo Investigate assignability
             */
            () => eq(
                column,
                value
            ) as any
        ),
    };
    return result;
}

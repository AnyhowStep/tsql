import * as tm from "type-mapping";
import {IFromClause} from "../../from-clause";
import {ColumnUtil} from "../../../column";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {NullSafeComparison} from "../../../expr-library";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {PrimitiveExprUtil, PrimitiveExpr} from "../../../primitive-expr";
import {RawExprUtil} from "../../../raw-expr";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereNullSafeEqImpl<
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<CurrentJoinsT>,
        PrimitiveExpr
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
            PrimitiveExprUtil.NullSafeCaseInsensitiveNarrow<
                tm.OutputOf<ColumnT["mapper"]>,
                ValueT
            >
        >
    }>
);
export type WhereNullSafeEq<
    FromClauseT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>,
        PrimitiveExpr
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>
> = (
    WhereNullSafeEqImpl<
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
export type WhereNullSafeEqDelegateImpl<
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<CurrentJoinsT>,
        PrimitiveExpr
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
                    PrimitiveExpr
                >
            >
        )
    ) => ColumnT
);
export type WhereNullSafeEqDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>,
        PrimitiveExpr
    >
> = (
    WhereNullSafeEqDelegateImpl<
        ColumnT,
        FromClauseT["currentJoins"]
    >
);
/**
 * Narrows a column's type based on null-safe equality to a value
 *
 * Given the below expression,
 * ```sql
 *  SELECT
 *      myTable.myColumn
 *  FROM
 *      myTable
 *  WHERE
 *      myTable.myColumn <=> 1
 * ```
 *
 * We know, without even executing the query,
 * that the type of `myTable.myColumn` for all rows
 * in the result set will be `1`.
 */
export function whereNullSafeEq<
    FromClauseT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>,
        PrimitiveExpr
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    /**
     * The database-specific `nullSafeEq` operator.
     *
     * Different databases have different operators that implement null-safe equality.
     *
     * + PostgreSQL uses `IS NOT DISTINCT FROM`
     * + MySQL uses `<=>`
     * + SQLite uses `IS`
     * + etc.
     *
     * @see {@link null-safe-eq.ts} for more details
     */
    nullSafeEq : NullSafeComparison,
    whereNullSafeEqDelegate : WhereNullSafeEqDelegate<FromClauseT, ColumnT>,
    value : ValueT
) : (
    {
        fromClause : WhereNullSafeEq<FromClauseT, ColumnT, ValueT>,
        whereClause : WhereClause,
    }
) {
    const columns = ColumnRefUtil.__noOp_extractWithType<PrimitiveExpr>()(
        ColumnRefUtil.fromColumnArray(
            ColumnUtil.fromJoinArray<FromClauseT["currentJoins"]>(fromClause.currentJoins)
        )
    );
    const column = whereNullSafeEqDelegate(
        ColumnRefUtil.tryFlatten(columns)
    );

    ColumnIdentifierRefUtil.assertHasColumnIdentifier(
        columns,
        column
    );

    const result : (
        {
            fromClause : WhereNullSafeEq<FromClauseT, ColumnT, ValueT>,
            whereClause : WhereClause,
        }
    ) = {
        fromClause : {
            outerQueryJoins : fromClause.outerQueryJoins,
            currentJoins : JoinArrayUtil.replaceColumn<
                FromClauseT["currentJoins"],
                ColumnT["tableAlias"],
                ColumnT["columnAlias"],
                PrimitiveExprUtil.NullSafeCaseInsensitiveNarrow<
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
                    () => PrimitiveExprUtil.NullSafeCaseInsensitiveNarrow<
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
            () => nullSafeEq(
                column,
                value
            ) as any
        ),
    };
    return result;
}

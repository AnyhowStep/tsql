import * as tm from "type-mapping";
import {IFromClause} from "../../from-clause";
import {ColumnUtil} from "../../../column";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {ColumnRefUtil} from "../../../column-ref";
import * as ExprLib from "../../../expr-library";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {BuiltInValueExprUtil, BuiltInValueExpr} from "../../../built-in-value-expr";
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
        BuiltInValueExpr
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>|null,
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"],
> = (
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : JoinArrayUtil.ReplaceColumn<
            CurrentJoinsT,
            ColumnT["tableAlias"],
            ColumnT["columnAlias"],
            BuiltInValueExprUtil.NullSafeCaseInsensitiveNarrow<
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
        BuiltInValueExpr
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>|null
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
        BuiltInValueExpr
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
                    BuiltInValueExpr
                >
            >
        )
    ) => ColumnT
);
export type WhereNullSafeEqDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>,
        BuiltInValueExpr
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
        BuiltInValueExpr
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>|null
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    /**
     * This construction effectively makes it impossible for `WhereNullSafeEqDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    ...args : (
        ColumnT extends ColumnUtil.ExtractWithType<
            ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>,
            BuiltInValueExpr
        > ?
        [
            WhereNullSafeEqDelegate<FromClauseT, ColumnT>,
            ValueT
        ] :
        never
    )
) : (
    {
        fromClause : WhereNullSafeEq<FromClauseT, ColumnT, ValueT>,
        whereClause : WhereClause,
    }
) {
    const whereNullSafeEqDelegate = args[0];
    const value = args[1];

    const columns = ColumnRefUtil.__noOp_extractWithType<BuiltInValueExpr>()(
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
                BuiltInValueExprUtil.NullSafeCaseInsensitiveNarrow<
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
                    () => BuiltInValueExprUtil.NullSafeCaseInsensitiveNarrow<
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
            () => ExprLib.nullSafeEq(
                column,
                value
            ) as any
        ),
    };
    return result;
}

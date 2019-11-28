import * as tm from "type-mapping";
import {IFromClause} from "../../from-clause";
import {ColumnUtil} from "../../../column";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {BuiltInValueExprUtil, NonNullBuiltInValueExpr} from "../../../built-in-value-expr";
import {RawExprUtil} from "../../../raw-expr";
import * as ExprLib from "../../../expr-library";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqImpl<
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<CurrentJoinsT>,
        NonNullBuiltInValueExpr
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
            BuiltInValueExprUtil.CaseInsensitiveNarrow<
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
        NonNullBuiltInValueExpr
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
        NonNullBuiltInValueExpr
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
                    NonNullBuiltInValueExpr
                >
            >
        )
    ) => ColumnT
);
export type WhereEqDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>,
        NonNullBuiltInValueExpr
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
        NonNullBuiltInValueExpr
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    /**
     * This construction effectively makes it impossible for `WhereEqDelegate<>`
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
            NonNullBuiltInValueExpr
        > ?
        [
            WhereEqDelegate<FromClauseT, ColumnT>,
            ValueT
        ] :
        never
    )
) : (
    {
        fromClause : WhereEq<FromClauseT, ColumnT, ValueT>,
        whereClause : WhereClause,
    }
) {
    const whereEqDelegate = args[0];
    const value = args[1];

    const columns = ColumnRefUtil.__noOp_extractWithType<NonNullBuiltInValueExpr>()(
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
                BuiltInValueExprUtil.CaseInsensitiveNarrow<
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
                    () => BuiltInValueExprUtil.CaseInsensitiveNarrow<
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
            () => ExprLib.eq(
                column,
                value
            ) as any
        ),
    };
    return result;
}

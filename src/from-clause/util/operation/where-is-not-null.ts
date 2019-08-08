import * as tm from "type-mapping";
import {IFromClause} from "../../from-clause";
import {ColumnUtil} from "../../../column";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {isNotNull} from "../../../expr-library";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereIsNotNullImpl<
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<CurrentJoinsT>
    >,
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"],
> = (
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : JoinArrayUtil.ReplaceColumn<
            CurrentJoinsT,
            ColumnT["tableAlias"],
            ColumnT["columnAlias"],
            Exclude<tm.OutputOf<ColumnT["mapper"]>, null>
        >
    }>
);
export type WhereIsNotNull<
    FromClauseT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>
    >
> = (
    WhereIsNotNullImpl<
        ColumnT,
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
export type WhereIsNotNullDelegateImpl<
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<CurrentJoinsT>
    >,
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> = (
    (
        columns : (
            ColumnRefUtil.TryFlatten<
                ColumnRefUtil.FromColumnArray<
                    ColumnUtil.ExtractNullable<
                        ColumnUtil.FromJoinArray<CurrentJoinsT>
                    >[]
                >
            >
        )
    ) => ColumnT
);
export type WhereIsNotNullDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>
    >
> = (
    WhereIsNotNullDelegateImpl<
        ColumnT,
        FromClauseT["currentJoins"]
    >
);
/**
 * Narrows a column's type to `null`
 *
 * Given the below expression,
 * ```sql
 *  SELECT
 *      myTable.myColumn
 *  FROM
 *      myTable
 *  WHERE
 *      myTable.myColumn IS NULL
 * ```
 *
 * We know, without even executing the query,
 * that the type of `myTable.myColumn` for all rows
 * in the result set will be `null`.
 */
export function whereIsNotNull<
    FromClauseT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>
    >
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    whereIsNotNullDelegate : WhereIsNotNullDelegate<FromClauseT, ColumnT>
) : (
    {
        fromClause : WhereIsNotNull<FromClauseT, ColumnT>,
        whereClause : WhereClause,
    }
) {
    const columns = ColumnRefUtil.fromColumnArray(
        ColumnUtil.extractNullable(
            ColumnUtil.fromJoinArray<FromClauseT["currentJoins"]>(fromClause.currentJoins)
        )
    );
    const column = whereIsNotNullDelegate(ColumnRefUtil.tryFlatten(
        columns
    ));

    ColumnIdentifierRefUtil.assertHasColumnIdentifier(
        columns,
        column
    );

    const result : (
        {
            fromClause : WhereIsNotNull<FromClauseT, ColumnT>,
            whereClause : WhereClause,
        }
    ) = {
        fromClause : {
            outerQueryJoins : fromClause.outerQueryJoins,
            currentJoins : JoinArrayUtil.replaceColumn<
                FromClauseT["currentJoins"],
                ColumnT["tableAlias"],
                ColumnT["columnAlias"],
                Exclude<tm.OutputOf<ColumnT["mapper"]>, null>
            >(
                fromClause.currentJoins,
                column.tableAlias,
                column.columnAlias,
                tm.excludeLiteral(column.mapper, null)
            ),
        },
        whereClause : WhereClauseUtil.where(
            fromClause,
            whereClause,
            () => isNotNull(column)
        ),
    };
    return result;
}

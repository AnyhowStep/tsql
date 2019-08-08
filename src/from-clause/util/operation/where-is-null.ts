import * as tm from "type-mapping";
import {IFromClause} from "../../from-clause";
import {ColumnUtil} from "../../../column";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {isNull} from "../../../expr-library";

export type WhereIsNull<
    FromClauseT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>
    >
> = (
    IFromClause<{
        outerQueryJoins : FromClauseT["outerQueryJoins"],
        currentJoins : JoinArrayUtil.ReplaceColumn<
            FromClauseT["currentJoins"],
            ColumnT["tableAlias"],
            ColumnT["columnAlias"],
            null
        >
    }>
);
export type WhereIsNullDelegate<
    FromClauseT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>
    >
> = (
    (
        columns : (
            ColumnRefUtil.TryFlatten<
                ColumnRefUtil.FromColumnArray<
                    ColumnUtil.ExtractNullable<
                        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>
                    >[]
                >
            >
        )
    ) => ColumnT
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
export function whereIsNull<
    FromClauseT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<FromClauseT["currentJoins"]>
    >
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    whereDelegate : WhereIsNullDelegate<FromClauseT, ColumnT>
) : (
    {
        fromClause : WhereIsNull<FromClauseT, ColumnT>,
        whereClause : WhereClause,
    }
) {
    const columns = ColumnRefUtil.tryFlatten(
        ColumnRefUtil.fromColumnArray(
            ColumnUtil.extractNullable(
                ColumnUtil.fromJoinArray<FromClauseT["currentJoins"]>(fromClause.currentJoins)
            )
        )
    );
    const column = whereDelegate(columns);
    const result : (
        {
            fromClause : WhereIsNull<FromClauseT, ColumnT>,
            whereClause : WhereClause,
        }
    ) = {
        fromClause : {
            outerQueryJoins : fromClause.outerQueryJoins,
            currentJoins : JoinArrayUtil.replaceColumn<
                FromClauseT["currentJoins"],
                ColumnT["tableAlias"],
                ColumnT["columnAlias"],
                null
            >(
                fromClause.currentJoins,
                column.tableAlias,
                column.columnAlias,
                tm.null()
            ),
        },
        whereClause : WhereClauseUtil.where(
            fromClause,
            whereClause,
            () => isNull(column)
        ),
    };
    return result;
}

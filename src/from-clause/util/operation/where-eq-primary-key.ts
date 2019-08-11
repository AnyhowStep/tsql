import {IFromClause} from "../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {eqPrimaryKey} from "../../../expr-library";
import {PrimaryKey} from "../../../primary-key";
import {JoinMapUtil} from "../../../join-map";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqPrimaryKeyImpl<
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"],
> = (
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : CurrentJoinsT,
    }>
);
/**
 * @todo Consider making `nullable` joins non-nullable when
 * used with `whereEqPrimaryKey()`
 *
 * Not a priority because people should not usually
 * write such a query.
 *
 * -----
 *
 * Assume `tableB.tableBId` is the primary key of `tableB`.
 *
 * Normally, `tableB` should be `nullable` in the following query,
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      tableA
 *  LEFT JOIN
 *      tableB
 *  ON
 *      tableA.tableBId = tableB.tableBId
 * ```
 *
 * However, `tableB` should not be `nullable` in the following query,
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      tableA
 *  LEFT JOIN
 *      tableB
 *  ON
 *      tableA.tableBId = tableB.tableBId
 *  WHERE
 *      tableB.tableBId = 1
 * ```
 */
export type WhereEqPrimaryKey<
    FromClauseT extends AfterFromClause
> = (
    WhereEqPrimaryKeyImpl<
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
export type WhereEqPrimaryKeyDelegateImpl<
    TableT extends JoinArrayUtil.ExtractWithPrimaryKey<CurrentJoinsT>,
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> = (
    (
        /**
         * Is called `tables` but is really a map of joins
         */
        tables : JoinMapUtil.FromJoinArray<
            JoinArrayUtil.ExtractWithPrimaryKey<CurrentJoinsT>[]
        >
    ) => TableT
);
export type WhereEqPrimaryKeyDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    TableT extends JoinArrayUtil.ExtractWithPrimaryKey<FromClauseT["currentJoins"]>
> = (
    WhereEqPrimaryKeyDelegateImpl<
        TableT,
        FromClauseT["currentJoins"]
    >
);
/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.eqPrimaryKey(
 *          myTable,
 *          myPrimaryKey
 *      ));
 * ```
 */
export function whereEqPrimaryKey<
    FromClauseT extends AfterFromClause,
    TableT extends JoinArrayUtil.ExtractWithPrimaryKey<FromClauseT["currentJoins"]>
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    /**
     * This construction effectively makes it impossible for `WhereEqPrimaryKeyDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    ...args : (
        TableT extends JoinArrayUtil.ExtractWithPrimaryKey<FromClauseT["currentJoins"]> ?
        [
            WhereEqPrimaryKeyDelegate<FromClauseT, TableT>,
            PrimaryKey<TableT>
        ] :
        never
    )
) : (
    {
        fromClause : WhereEqPrimaryKey<FromClauseT>,
        whereClause : WhereClause,
    }
) {
    const whereEqPrimaryKeyDelegate = args[0];
    const primaryKey = args[1];
    const table : TableT = whereEqPrimaryKeyDelegate(
        JoinMapUtil.fromJoinArray(
            JoinArrayUtil.extractWithPrimaryKey<FromClauseT["currentJoins"]>(
                fromClause.currentJoins
            )
        )
    ) as TableT;

    const result : (
        {
            fromClause : WhereEqPrimaryKey<FromClauseT>,
            whereClause : WhereClause,
        }
    ) = {
        fromClause,
        whereClause : WhereClauseUtil.where<FromClauseT>(
            fromClause,
            whereClause,
            /**
             * @todo Investigate assignability
             */
            () => eqPrimaryKey(
                table,
                /**
                 * @todo Investigate assignability
                 */
                primaryKey as any
            ) as any
        ),
    };
    return result;
}

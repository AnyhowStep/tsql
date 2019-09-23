import {IFromClause} from "../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {JoinMapUtil} from "../../../join-map";
import {EqSuperKey} from "../../../expr-library";
import {SuperKey_NonUnion} from "../../../super-key";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqSuperKeyImpl<
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
 * used with `whereEqSuperKey()`
 *
 * Not a priority because people should not usually
 * write such a query.
 *
 * -----
 *
 * Assume `tableB.tableBId` is the candidate key of `tableB`.
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
 *      --If you want to follow the SQL standard,
 *      --tableB.tableBId IS NOT DISTINCT FROM 1
 *      tableB.tableBId <=> 1 AND
 *      tableB.otherColumn <=> 'hi'
 * ```
 */
export type WhereEqSuperKey<
    FromClauseT extends AfterFromClause
> = (
    WhereEqSuperKeyImpl<
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
export type WhereEqSuperKeyDelegateImpl<
    TableT extends JoinArrayUtil.ExtractWithCandidateKey<CurrentJoinsT>,
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> = (
    (
        /**
         * Is called `tables` but is really a map of joins
         */
        tables : JoinMapUtil.FromJoinArray<
            JoinArrayUtil.ExtractWithCandidateKey<CurrentJoinsT>[]
        >
    ) => TableT
);
export type WhereEqSuperKeyDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    TableT extends JoinArrayUtil.ExtractWithCandidateKey<FromClauseT["currentJoins"]>
> = (
    WhereEqSuperKeyDelegateImpl<
        TableT,
        FromClauseT["currentJoins"]
    >
);
/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.eqSuperKey(
 *          myTable,
 *          mySuperKey
 *      ));
 * ```
 *
 * -----
 *
 * It is recommended to **only** use this with **object literals**.
 * Excess property checks are disabled for non-object literals.
 * Even if they were enabled, it is possible to slip in extra properties.
 *
 * Extra properties are ignored during run-time but may indicate lapses in logic.
 *
 */
export function whereEqSuperKey<
    FromClauseT extends AfterFromClause,
    TableT extends JoinArrayUtil.ExtractWithCandidateKey<FromClauseT["currentJoins"]>
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    /**
     * @todo Remove this
     */
    eqSuperKey : EqSuperKey,
    /**
     * This construction effectively makes it impossible for `WhereEqSuperKeyDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    ...args : (
        TableT extends JoinArrayUtil.ExtractWithCandidateKey<FromClauseT["currentJoins"]> ?
        [
            WhereEqSuperKeyDelegate<FromClauseT, TableT>,
            SuperKey_NonUnion<TableT>
        ] :
        never
    )
) : (
    {
        fromClause : WhereEqSuperKey<FromClauseT>,
        whereClause : WhereClause,
    }
) {
    const whereEqSuperKeyDelegate = args[0];
    const superKey = args[1];

    const table : TableT = whereEqSuperKeyDelegate(
        JoinMapUtil.fromJoinArray(
            JoinArrayUtil.extractWithCandidateKey<FromClauseT["currentJoins"]>(
                fromClause.currentJoins
            )
        )
    ) as TableT;

    const result : (
        {
            fromClause : WhereEqSuperKey<FromClauseT>,
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
            () => eqSuperKey(
                table,
                superKey
            ) as any
        ),
    };
    return result;
}

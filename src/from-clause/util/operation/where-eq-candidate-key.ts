import {IFromClause} from "../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {JoinMapUtil} from "../../../join-map";
import {CandidateKey_NonUnion} from "../../../candidate-key";
import * as ExprLib from "../../../expr-library";
import {StrictUnion} from "../../../type-util";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqCandidateKeyImpl<
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
 * used with `whereEqCandidateKey()`
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
 *      tableB.tableBId <=> 1
 * ```
 */
export type WhereEqCandidateKey<
    FromClauseT extends AfterFromClause
> = (
    WhereEqCandidateKeyImpl<
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
export type WhereEqCandidateKeyDelegateImpl<
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
export type WhereEqCandidateKeyDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    TableT extends JoinArrayUtil.ExtractWithCandidateKey<FromClauseT["currentJoins"]>
> = (
    WhereEqCandidateKeyDelegateImpl<
        TableT,
        FromClauseT["currentJoins"]
    >
);
/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.eqCandidateKey(
 *          myTable,
 *          myCandidateKey
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
 * -----
 *
 * Excess properties are especially dangerous for this function.
 *
 * If your `candidateKeyInput` is actually a super key of two candidate keys,
 * then the candidate key this function compares against is arbitrary.
 *
 * The extra properties will be discarded.
 *
 * If you want to compare against a super key, use `whereEqSuperKey()` instead.
 *
 */
export function whereEqCandidateKey<
    FromClauseT extends AfterFromClause,
    TableT extends JoinArrayUtil.ExtractWithCandidateKey<FromClauseT["currentJoins"]>
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    /**
     * This construction effectively makes it impossible for `WhereEqCandidateKeyDelegate<>`
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
            WhereEqCandidateKeyDelegate<FromClauseT, TableT>,
            StrictUnion<CandidateKey_NonUnion<TableT>>
        ] :
        never
    )
) : (
    {
        fromClause : WhereEqCandidateKey<FromClauseT>,
        whereClause : WhereClause,
    }
) {
    const whereEqCandidateKeyDelegate = args[0];
    const candidateKey = args[1];

    const table : TableT = whereEqCandidateKeyDelegate(
        JoinMapUtil.fromJoinArray(
            JoinArrayUtil.extractWithCandidateKey<FromClauseT["currentJoins"]>(
                fromClause.currentJoins
            )
        )
    ) as TableT;

    const result : (
        {
            fromClause : WhereEqCandidateKey<FromClauseT>,
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
            () => ExprLib.eqCandidateKey(
                table,
                candidateKey
            ) as any
        ),
    };
    return result;
}

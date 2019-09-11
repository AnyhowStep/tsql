import {IFromClause} from "../../from-clause";
import {AfterFromClause} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {JoinMapUtil} from "../../../join-map";
import * as ExprLib from "../../../expr-library";
import {PartialRow_NonUnion} from "../../../partial-row";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqColumnsImpl<
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"],
> = (
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : CurrentJoinsT,
    }>
);
/**
 * @todo Consider narrowing the values of columns?
 * @todo If at least one of the columns is narrowed to non-null, make the `IJoin` non-nullable?
 */
export type WhereEqColumns<
    FromClauseT extends AfterFromClause
> = (
    WhereEqColumnsImpl<
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
export type WhereEqColumnsDelegateImpl<
    TableT extends CurrentJoinsT[number],
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> = (
    (
        /**
         * Is called `tables` but is really a map of joins
         */
        tables : JoinMapUtil.FromJoinArray<CurrentJoinsT>
    ) => TableT
);
export type WhereEqColumnsDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    TableT extends FromClauseT["currentJoins"][number]
> = (
    WhereEqColumnsDelegateImpl<
        TableT,
        FromClauseT["currentJoins"]
    >
);
/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.eqColumns(
 *          myTable,
 *          myColumns
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
export function whereEqColumns<
    FromClauseT extends AfterFromClause,
    TableT extends FromClauseT["currentJoins"][number]
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    /**
     * This construction effectively makes it impossible for `WhereEqColumnsDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    ...args : (
        TableT extends FromClauseT["currentJoins"][number] ?
        [
            WhereEqColumnsDelegate<FromClauseT, TableT>,
            PartialRow_NonUnion<TableT>
        ] :
        never
    )
) : (
    {
        fromClause : WhereEqColumns<FromClauseT>,
        whereClause : WhereClause,
    }
) {
    const whereEqColumnsDelegate = args[0];
    const columns : PartialRow_NonUnion<TableT> = args[1];
    /**
     * @todo Investigate assignability
     */
    const table : TableT = whereEqColumnsDelegate(
        JoinMapUtil.fromJoinArray<FromClauseT["currentJoins"]>(
            fromClause.currentJoins
        )
    ) as FromClauseT["currentJoins"][number] as TableT;

    const result : (
        {
            fromClause : WhereEqColumns<FromClauseT>,
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
            () => ExprLib.eqColumns<TableT>(
                table,
                /**
                 * @todo Investigate assignability
                 */
                columns as any
            ) as any
        ),
    };
    return result;
}

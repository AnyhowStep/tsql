import {IFromClause} from "../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause, Correlated} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import * as ExprLib from "../../../expr-library";
import {JoinMapUtil} from "../../../join-map";
import {TableUtil} from "../../../table";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqOuterQueryPrimaryKeyImpl<
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"],
> = (
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : CurrentJoinsT,
    }>
);
export type WhereEqOuterQueryPrimaryKey<
    FromClauseT extends AfterFromClause
> = (
    WhereEqOuterQueryPrimaryKeyImpl<
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
export type WhereEqOuterQueryPrimaryKeySrcDelegateImpl<
    SrcT extends CurrentJoinsT[number],
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> = (
    (
        /**
         * Is called `tables` but is really a map of joins
         */
        tables : JoinMapUtil.FromJoinArray<CurrentJoinsT>
    ) => SrcT
);
export type WhereEqOuterQueryPrimaryKeySrcDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    SrcT extends FromClauseT["currentJoins"][number]
> = (
    WhereEqOuterQueryPrimaryKeySrcDelegateImpl<
        SrcT,
        FromClauseT["currentJoins"]
    >
);
/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqOuterQueryPrimaryKeyDstDelegateImpl<
    SrcT extends CurrentJoinsT[number],
    DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<OuterQueryJoinsT, SrcT["columns"]>,
    CurrentJoinsT extends AfterFromClause["currentJoins"],
    OuterQueryJoinsT extends Correlated["outerQueryJoins"]
> = (
    (
        /**
         * Is called `tables` but is really a map of joins
         */
        tables : JoinMapUtil.FromJoinArray<
            JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<OuterQueryJoinsT, SrcT["columns"]>[]
        >
    ) => DstT
);
export type WhereEqOuterQueryPrimaryKeyDstDelegate<
    FromClauseT extends (Correlated & AfterFromClause),
    SrcT extends FromClauseT["currentJoins"][number],
    DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<FromClauseT["outerQueryJoins"], SrcT["columns"]>
> = (
    WhereEqOuterQueryPrimaryKeyDstDelegateImpl<
        SrcT,
        DstT,
        FromClauseT["currentJoins"],
        FromClauseT["outerQueryJoins"]
    >
);
/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.eqPrimaryKeyOfTable(
 *          currentQueryTable,
 *          outerQueryTable
 *      ));
 * ```
 * -----
 *
 * + The `currentQueryTable` does not need to have keys.
 * + The `outerQueryTable` must have a primary key.
 * + The `currentQueryTable` must have columns comparable to columns of `outerQueryTable`'s primary key.
 */
export function whereEqOuterQueryPrimaryKey<
    FromClauseT extends (Correlated & AfterFromClause),
    SrcT extends FromClauseT["currentJoins"][number],
    DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<FromClauseT["outerQueryJoins"], SrcT["columns"]>
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    /**
     * This construction effectively makes it impossible for
     * `WhereEqOuterQueryPrimaryKeySrcDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    srcDelegate : (
        SrcT extends FromClauseT["currentJoins"][number] ?
        WhereEqOuterQueryPrimaryKeySrcDelegate<FromClauseT, SrcT> :
        never
    ),
    dstDelegate : (
        WhereEqOuterQueryPrimaryKeyDstDelegate<
            FromClauseT,
            SrcT,
            DstT
        >
    )
) : (
    {
        fromClause : WhereEqOuterQueryPrimaryKey<FromClauseT>,
        whereClause : WhereClause,
    }
) {
    const src : SrcT = srcDelegate(
        JoinMapUtil.fromJoinArray<FromClauseT["currentJoins"]>(
            fromClause.currentJoins
        )
    ) as SrcT;
    const dst : DstT = dstDelegate(
        JoinMapUtil.fromJoinArray(
            JoinArrayUtil.extractWithNullSafeComparablePrimaryKey<FromClauseT["outerQueryJoins"], SrcT["columns"]>(
                fromClause.outerQueryJoins,
                src.columns
            )
        )
    );

    const result : (
        {
            fromClause : WhereEqOuterQueryPrimaryKey<FromClauseT>,
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
            () => ExprLib.eqPrimaryKeyOfTable<SrcT, DstT>(
                src,
                dst as (
                    & DstT
                    & TableUtil.AssertHasNullSafeComparablePrimaryKey<DstT, SrcT["columns"]>
                )
            ) as any
        ),
    };
    return result;
}

import {IFromClause} from "../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause, Correlated} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import * as ExprLib from "../../../expr-library";
import {JoinMapUtil} from "../../../join-map";
import {TableUtil} from "../../../table";
import {AssertNonUnion} from "../../../type-util";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqInnerQueryPrimaryKeyImpl<
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"],
> = (
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : CurrentJoinsT,
    }>
);
export type WhereEqInnerQueryPrimaryKey<
    FromClauseT extends AfterFromClause
> = (
    WhereEqInnerQueryPrimaryKeyImpl<
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
export type WhereEqInnerQueryPrimaryKeySrcDelegateImpl<
    SrcT extends OuterQueryJoinsT[number],
    OuterQueryJoinsT extends Correlated["outerQueryJoins"]
> = (
    (
        /**
         * Is called `tables` but is really a map of joins
         */
        tables : JoinMapUtil.FromJoinArray<OuterQueryJoinsT>
    ) => SrcT & AssertNonUnion<SrcT>
);
export type WhereEqInnerQueryPrimaryKeySrcDelegate<
    FromClauseT extends Pick<Correlated, "outerQueryJoins">,
    SrcT extends FromClauseT["outerQueryJoins"][number]
> = (
    WhereEqInnerQueryPrimaryKeySrcDelegateImpl<
        SrcT,
        FromClauseT["outerQueryJoins"]
    >
);
/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqInnerQueryPrimaryKeyDstDelegateImpl<
    SrcT extends OuterQueryJoinsT[number],
    DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<CurrentJoinsT, SrcT["columns"]>,
    OuterQueryJoinsT extends Correlated["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> = (
    (
        /**
         * Is called `tables` but is really a map of joins
         */
        tables : JoinMapUtil.FromJoinArray<
            JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<CurrentJoinsT, SrcT["columns"]>[]
        >
    ) => DstT
);
export type WhereEqInnerQueryPrimaryKeyDstDelegate<
    FromClauseT extends (Correlated & AfterFromClause),
    SrcT extends FromClauseT["outerQueryJoins"][number],
    DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<FromClauseT["currentJoins"], SrcT["columns"]>
> = (
    WhereEqInnerQueryPrimaryKeyDstDelegateImpl<
        SrcT,
        DstT,
        FromClauseT["outerQueryJoins"],
        FromClauseT["currentJoins"]
    >
);
/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.eqPrimaryKeyOfTable(
 *          outerQueryTable,
 *          currentQueryTable
 *      ));
 * ```
 * -----
 *
 * + The `outerQueryTable` does not need to have keys.
 * + The `currentQueryTable` must have a primary key.
 * + The `outerQueryTable` must have columns comparable to columns of `currentQueryTable`'s primary key.
 */
export function whereEqInnerQueryPrimaryKey<
    FromClauseT extends (Correlated & AfterFromClause),
    SrcT extends FromClauseT["outerQueryJoins"][number],
    DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<FromClauseT["currentJoins"], SrcT["columns"]>
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    srcDelegate : WhereEqInnerQueryPrimaryKeySrcDelegate<FromClauseT, SrcT>,
    dstDelegate : (
        WhereEqInnerQueryPrimaryKeyDstDelegate<
            FromClauseT,
            SrcT,
            DstT
        >
    )
) : (
    {
        fromClause : WhereEqInnerQueryPrimaryKey<FromClauseT>,
        whereClause : WhereClause,
    }
) {
    const src : SrcT = srcDelegate(
        JoinMapUtil.fromJoinArray<FromClauseT["outerQueryJoins"]>(
            fromClause.outerQueryJoins
        )
    ) as SrcT;
    const dst : DstT = dstDelegate(
        JoinMapUtil.fromJoinArray(
            JoinArrayUtil.extractWithNullSafeComparablePrimaryKey<FromClauseT["currentJoins"], SrcT["columns"]>(
                fromClause.currentJoins,
                src.columns
            )
        )
    );

    const result : (
        {
            fromClause : WhereEqInnerQueryPrimaryKey<FromClauseT>,
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

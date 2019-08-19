import {IFromClause} from "../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause, Correlated} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {EqCandidateKeyOfTable, EqCandidateKeyOfTableDelegate} from "../../../expr-library";
import {JoinMapUtil} from "../../../join-map";
import {TableUtil} from "../../../table";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqOuterQueryCandidateKeyImpl<
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"],
> = (
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : CurrentJoinsT,
    }>
);
export type WhereEqOuterQueryCandidateKey<
    FromClauseT extends AfterFromClause
> = (
    WhereEqOuterQueryCandidateKeyImpl<
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
export type WhereEqOuterQueryCandidateKeySrcDelegateImpl<
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
export type WhereEqOuterQueryCandidateKeySrcDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    SrcT extends FromClauseT["currentJoins"][number]
> = (
    WhereEqOuterQueryCandidateKeySrcDelegateImpl<
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
export type WhereEqOuterQueryCandidateKeyDstDelegateImpl<
    DstT extends JoinArrayUtil.ExtractWithCandidateKey<OuterQueryJoinsT>,
    OuterQueryJoinsT extends Correlated["outerQueryJoins"]
> = (
    (
        /**
         * Is called `tables` but is really a map of joins
         */
        tables : JoinMapUtil.FromJoinArray<
            JoinArrayUtil.ExtractWithCandidateKey<OuterQueryJoinsT>[]
        >
    ) => DstT
);
export type WhereEqOuterQueryCandidateKeyDstDelegate<
    FromClauseT extends (Correlated & AfterFromClause),
    DstT extends JoinArrayUtil.ExtractWithCandidateKey<FromClauseT["outerQueryJoins"]>
> = (
    WhereEqOuterQueryCandidateKeyDstDelegateImpl<
        DstT,
        FromClauseT["outerQueryJoins"]
    >
);
/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.eqCandidateKeyOfTable(
 *          currentQueryTable,
 *          outerQueryTable,
 *          columns => [
 *              columns.candidateKey0,
 *              columns.candidateKey1,
 *              //etc.
 *          ]
 *      ));
 * ```
 * -----
 *
 * + The `currentQueryTable` does not need to have keys.
 * + The `outerQueryTable` must have at least one candidate key.
 * + The `currentQueryTable` must have columns comparable to columns of `outerQueryTable`'s candidate key.
 */
export function whereEqOuterQueryCandidateKey<
    FromClauseT extends (Correlated & AfterFromClause),
    SrcT extends FromClauseT["currentJoins"][number],
    DstT extends JoinArrayUtil.ExtractWithCandidateKey<FromClauseT["outerQueryJoins"]>,
    SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    eqCandidateKeyOfTable : EqCandidateKeyOfTable,
    srcDelegate : WhereEqOuterQueryCandidateKeySrcDelegate<FromClauseT, SrcT>,
    dstDelegate : (
        WhereEqOuterQueryCandidateKeyDstDelegate<
            FromClauseT,
            DstT
        >
    ),
    eqCandidateKeyofTableDelegate : EqCandidateKeyOfTableDelegate<SrcT, DstT, SrcColumnsT>
) : (
    {
        fromClause : WhereEqOuterQueryCandidateKey<FromClauseT>,
        whereClause : WhereClause,
    }
) {
    const src : SrcT = srcDelegate(
        JoinMapUtil.fromJoinArray<FromClauseT["currentJoins"]>(
            fromClause.currentJoins
        )
    );
    const dst : DstT = dstDelegate(
        JoinMapUtil.fromJoinArray(
            JoinArrayUtil.extractWithCandidateKey<FromClauseT["outerQueryJoins"]>(
                fromClause.outerQueryJoins
            )
        )
    );
    ;

    const result : (
        {
            fromClause : WhereEqOuterQueryCandidateKey<FromClauseT>,
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
            () => eqCandidateKeyOfTable<SrcT, DstT, SrcColumnsT>(
                src,
                dst,
                eqCandidateKeyofTableDelegate
            ) as any
        ),
    };
    return result;
}

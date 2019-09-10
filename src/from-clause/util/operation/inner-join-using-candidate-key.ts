import * as tm from "type-mapping";
import {IFromClause} from "../../from-clause";
import {AfterFromClause} from "../helper-type";
import {IAliasedTable} from "../../../aliased-table";
import {assertAfterFromClause, assertValidCurrentJoinBase, AssertValidCurrentJoinBase} from "../predicate";
import {JoinArrayUtil, JoinUtil} from "../../../join";
import {AssertNonUnion} from "../../../type-util";
import {TableUtil, ITable} from "../../../table";
import {JoinMapUtil} from "../../../join-map";
import {innerJoin} from "./inner-join";
import * as ExprLib from "../../../expr-library";
import {Expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type InnerJoinUsingCandidateKeyImpl<
    AliasedTableT extends IAliasedTable,
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> =
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : JoinArrayUtil.Append<
            CurrentJoinsT,
            JoinUtil.FromAliasedTable<AliasedTableT, false>
        >,
    }>
;
export type InnerJoinUsingCandidateKey<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> =
    InnerJoinUsingCandidateKeyImpl<
        AliasedTableT,
        FromClauseT["outerQueryJoins"],
        FromClauseT["currentJoins"]
    >
;

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type InnerJoinUsingCandidateKeySrcDelegateImpl<
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
export type InnerJoinUsingCandidateKeySrcDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    SrcT extends FromClauseT["currentJoins"][number]
> = (
    InnerJoinUsingCandidateKeySrcDelegateImpl<
        SrcT,
        FromClauseT["currentJoins"]
    >
);
/**
 * Shorthand for,
 * ```ts
 *  //snip
 *  .innerJoin(
 *      otherTable,
 *      () => tsql.eqCandidateKeyOfTable(
 *          myTable,
 *          otherTable,
 *          columns => [
 *              columns.candidateKey0,
 *              columns.candidateKey1,
 *              //etc.
 *          ]
 *      )
 *  )
 * ```
 *
 * ```sql
 *  INNER JOIN
 *      otherTable
 *  ON
 *      myTable.otherTableCk0 <=> otherTable.otherTableCk0 AND
 *      myTable.otherTableCk1 <=> otherTable.otherTableCk1 AND
 *      myTable.otherTableCk2 <=> otherTable.otherTableCk2 AND
 *      --snip
 * ```
 */
export function innerJoinUsingCandidateKey<
    FromClauseT extends AfterFromClause,
    SrcT extends FromClauseT["currentJoins"][number],
    DstT extends ITable,
    SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
> (
    fromClause : FromClauseT,
    srcDelegate : InnerJoinUsingCandidateKeySrcDelegate<FromClauseT, SrcT>,
    aliasedTable : (
        & DstT
        & AssertNonUnion<DstT>
        & AssertValidCurrentJoinBase<FromClauseT, DstT>
    ),
    eqCandidateKeyofTableDelegate : ExprLib.EqCandidateKeyOfTableDelegate<SrcT, DstT, SrcColumnsT>
) : (
    InnerJoinUsingCandidateKey<FromClauseT, DstT>
) {
    assertAfterFromClause(fromClause);
    assertValidCurrentJoinBase(fromClause, aliasedTable);

    const src : SrcT = srcDelegate(
        JoinMapUtil.fromJoinArray<FromClauseT["currentJoins"]>(
            fromClause.currentJoins
        )
    ) as SrcT;

    const result : InnerJoinUsingCandidateKey<FromClauseT, DstT> = innerJoin<
        FromClauseT,
        DstT,
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>
        }>
    >(
        fromClause,
        aliasedTable,
        () => {
            /**
             * @todo Investigate assignability
             */
            return ExprLib.eqCandidateKeyOfTable<
                SrcT,
                DstT,
                SrcColumnsT
            >(
                src,
                aliasedTable,
                eqCandidateKeyofTableDelegate
            ) as any;
        }
    );
    return result;
}

import * as tm from "type-mapping";
import {IFromClause} from "../../from-clause";
import {AfterFromClause} from "../helper-type";
import {IAliasedTable} from "../../../aliased-table";
import {assertAfterFromClause, assertValidCurrentJoinBase, AssertValidCurrentJoinBase} from "../predicate";
import {JoinArrayUtil, JoinUtil} from "../../../join";
import {AssertNonUnion} from "../../../type-util";
import {TableWithPrimaryKey, TableUtil} from "../../../table";
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
export type InnerJoinUsingPrimaryKeyImpl<
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
export type InnerJoinUsingPrimaryKey<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> =
    InnerJoinUsingPrimaryKeyImpl<
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
export type InnerJoinUsingPrimaryKeySrcDelegateImpl<
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
export type InnerJoinUsingPrimaryKeySrcDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    SrcT extends FromClauseT["currentJoins"][number]
> = (
    InnerJoinUsingPrimaryKeySrcDelegateImpl<
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
 *      () => tsql.eqPrimaryKeyOfTable(
 *          myTable,
 *          otherTable
 *      )
 *  )
 * ```
 *
 * ```sql
 *  INNER JOIN
 *      otherTable
 *  ON
 *      myTable.otherTablePk0 <=> otherTable.otherTablePk0 AND
 *      myTable.otherTablePk1 <=> otherTable.otherTablePk1 AND
 *      myTable.otherTablePk2 <=> otherTable.otherTablePk2 AND
 *      --snip
 * ```
 */
export function innerJoinUsingPrimaryKey<
    FromClauseT extends AfterFromClause,
    SrcT extends FromClauseT["currentJoins"][number],
    DstT extends TableWithPrimaryKey
> (
    fromClause : FromClauseT,
    srcDelegate : InnerJoinUsingPrimaryKeySrcDelegate<FromClauseT, SrcT>,
    aliasedTable : (
        & DstT
        & AssertNonUnion<DstT>
        & AssertValidCurrentJoinBase<FromClauseT, DstT>
        & TableUtil.AssertHasNullSafeComparablePrimaryKey<DstT, SrcT["columns"]>
    )
) : (
    InnerJoinUsingPrimaryKey<FromClauseT, DstT>
) {
    assertAfterFromClause(fromClause);
    assertValidCurrentJoinBase(fromClause, aliasedTable);

    const src : SrcT = srcDelegate(
        JoinMapUtil.fromJoinArray<FromClauseT["currentJoins"]>(
            fromClause.currentJoins
        )
    ) as SrcT;

    const result : InnerJoinUsingPrimaryKey<FromClauseT, DstT> = innerJoin<
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
            return ExprLib.eqPrimaryKeyOfTable<
                SrcT,
                DstT
            >(
                src,
                aliasedTable
            ) as any;
        }
    );
    return result;
}

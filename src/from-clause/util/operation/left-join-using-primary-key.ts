import * as tm from "type-mapping";
import {IFromClause} from "../../from-clause";
import {AfterFromClause} from "../helper-type";
import {IAliasedTable} from "../../../aliased-table";
import {assertAfterFromClause, assertValidCurrentJoinBase, AssertValidCurrentJoinBase} from "../predicate";
import {JoinArrayUtil, JoinUtil} from "../../../join";
import {AssertNonUnion} from "../../../type-util";
import {TableWithPrimaryKey, TableUtil} from "../../../table";
import {JoinMapUtil} from "../../../join-map";
import {leftJoin} from "./left-join";
import * as ExprLib from "../../../expr-library";
import {Expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type LeftJoinUsingPrimaryKeyImpl<
    AliasedTableT extends IAliasedTable,
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> =
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : JoinArrayUtil.Append<
            CurrentJoinsT,
            JoinUtil.FromAliasedTable<AliasedTableT, true>
        >,
    }>
;
export type LeftJoinUsingPrimaryKey<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> =
    LeftJoinUsingPrimaryKeyImpl<
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
export type LeftJoinUsingPrimaryKeySrcDelegateImpl<
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
export type LeftJoinUsingPrimaryKeySrcDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    SrcT extends FromClauseT["currentJoins"][number]
> = (
    LeftJoinUsingPrimaryKeySrcDelegateImpl<
        SrcT,
        FromClauseT["currentJoins"]
    >
);
/**
 * Shorthand for,
 * ```ts
 *  //snip
 *  .leftJoin(
 *      otherTable,
 *      () => tsql.eqPrimaryKeyOfTable(
 *          myTable,
 *          otherTable
 *      )
 *  )
 * ```
 *
 * ```sql
 *  LEFT JOIN
 *      otherTable
 *  ON
 *      myTable.otherTablePk0 <=> otherTable.otherTablePk0 AND
 *      myTable.otherTablePk1 <=> otherTable.otherTablePk1 AND
 *      myTable.otherTablePk2 <=> otherTable.otherTablePk2 AND
 *      --snip
 * ```
 */
export function leftJoinUsingPrimaryKey<
    FromClauseT extends AfterFromClause,
    SrcT extends FromClauseT["currentJoins"][number],
    DstT extends TableWithPrimaryKey
> (
    fromClause : FromClauseT,
    srcDelegate : LeftJoinUsingPrimaryKeySrcDelegate<FromClauseT, SrcT>,
    aliasedTable : (
        & DstT
        & AssertNonUnion<DstT>
        & AssertValidCurrentJoinBase<FromClauseT, DstT>
        & TableUtil.AssertHasNullSafeComparablePrimaryKey<DstT, SrcT["columns"]>
    )
) : (
    LeftJoinUsingPrimaryKey<FromClauseT, DstT>
) {
    assertAfterFromClause(fromClause);
    assertValidCurrentJoinBase(fromClause, aliasedTable);

    const src : SrcT = srcDelegate(
        JoinMapUtil.fromJoinArray<FromClauseT["currentJoins"]>(
            fromClause.currentJoins
        )
    ) as SrcT;

    const result : LeftJoinUsingPrimaryKey<FromClauseT, DstT> = leftJoin<
        FromClauseT,
        DstT,
        Expr<{
            mapper : tm.SafeMapper<boolean>,
            usedRef : UsedRefUtil.FromColumnMap<SrcT["columns"]|DstT["columns"]>,
            isAggregate : false,
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

import {IFromClause} from "../../from-clause";
import {AfterFromClause} from "../helper-type";
import {IAliasedTable} from "../../../aliased-table";
import {assertAfterFromClause, assertValidCurrentJoinBase, AssertValidCurrentJoinBase} from "../predicate";
import {JoinArrayUtil, JoinUtil, JoinType} from "../../../join";
import {AssertNonUnion} from "../../../type-util";
import {OnDelegate, OnUtil} from "../../../on-clause";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type InnerJoinImpl<
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
export type InnerJoin<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> =
    InnerJoinImpl<
        AliasedTableT,
        FromClauseT["outerQueryJoins"],
        FromClauseT["currentJoins"]
    >
;

/**
 * ```sql
 *  INNER JOIN
 *      myTable
 *  ON
 *      --condition
 * ```
 */
export function innerJoin<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> (
    fromClause : FromClauseT,
    aliasedTable : (
        & AliasedTableT
        & AssertNonUnion<AliasedTableT>
        & AssertValidCurrentJoinBase<FromClauseT, AliasedTableT>
    ),
    onDelegate : OnDelegate<FromClauseT, AliasedTableT>
) : (
    InnerJoin<FromClauseT, AliasedTableT>
) {
    assertAfterFromClause(fromClause);
    assertValidCurrentJoinBase(fromClause, aliasedTable);

    const result : InnerJoin<FromClauseT, AliasedTableT> = {
        outerQueryJoins : fromClause.outerQueryJoins,
        currentJoins : JoinArrayUtil.append(
            fromClause.currentJoins,
            JoinUtil.fromAliasedTable(
                aliasedTable,
                false,
                JoinType.INNER,
                OnUtil.on<
                    FromClauseT,
                    AliasedTableT
                >(
                    fromClause,
                    aliasedTable,
                    onDelegate
                )
            )
        ),
    };
    return result;
}

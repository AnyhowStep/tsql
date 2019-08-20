import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {AfterFromClause} from "../helper-type";
import {JoinUtil, JoinType, JoinArrayUtil} from "../../../join";
import {assertAfterFromClause, assertValidCurrentJoinBase, AssertValidCurrentJoinBase} from "../predicate";
import {AssertNonUnion} from "../../../type-util";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type CrossJoinImpl<
    AliasedTableT extends IAliasedTable,
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> = (
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : JoinArrayUtil.Append<
            CurrentJoinsT,
            JoinUtil.FromAliasedTable<AliasedTableT, false>
        >,
    }>
);
export type CrossJoin<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> = (
    CrossJoinImpl<
        AliasedTableT,
        FromClauseT["outerQueryJoins"],
        FromClauseT["currentJoins"]
    >
);
export function crossJoin<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> (
    fromClause : FromClauseT,
    aliasedTable : (
        & AliasedTableT
        & AssertNonUnion<AliasedTableT>
        & AssertValidCurrentJoinBase<FromClauseT, AliasedTableT>
    )
) : (
    CrossJoin<FromClauseT, AliasedTableT>
) {
    assertAfterFromClause(fromClause);
    assertValidCurrentJoinBase(fromClause, aliasedTable);

    const result : CrossJoin<FromClauseT, AliasedTableT> = {
        outerQueryJoins : fromClause.outerQueryJoins,
        currentJoins : JoinArrayUtil.append(
            fromClause.currentJoins,
            JoinUtil.fromAliasedTable(aliasedTable, false, JoinType.CROSS, undefined)
        ),
    };
    return result;
}

import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {AfterFromClause} from "../helper-type";
import {JoinUtil, JoinType, JoinArrayUtil} from "../../../join";
import {assertAfterFromClause, assertValidCurrentJoinBase, AssertValidCurrentJoinBase} from "../predicate";

export type CrossJoin<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> = (
    IFromClause<{
        outerQueryJoins : FromClauseT["outerQueryJoins"],
        currentJoins : JoinArrayUtil.Append<
            FromClauseT["currentJoins"],
            JoinUtil.FromAliasedTable<AliasedTableT, false>
        >,
    }>
);
export function crossJoin<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> (
    fromClause : FromClauseT,
    aliasedTable : (
        & AliasedTableT
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
            JoinUtil.fromAliasedTable(aliasedTable, false, JoinType.CROSS, [], [])
        ),
    };
    return result;
}

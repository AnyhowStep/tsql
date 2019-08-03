import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {BeforeFromClause} from "../helper-type";
import {JoinUtil, JoinType} from "../../../join";
import {assertBeforeFromClause, assertValidCurrentJoinBase, AssertValidCurentJoinBase} from "../predicate";

export type From<
    FromClauseT extends BeforeFromClause,
    AliasedTableT extends IAliasedTable
> = (
    IFromClause<{
        outerQueryJoins : FromClauseT["outerQueryJoins"],
        currentJoins : readonly JoinUtil.FromAliasedTable<AliasedTableT, false>[],
    }>
);
export function from<
    FromClauseT extends BeforeFromClause,
    AliasedTableT extends IAliasedTable
> (
    fromClause : FromClauseT,
    aliasedTable : (
        & AliasedTableT
        & AssertValidCurentJoinBase<FromClauseT, AliasedTableT>
    )
) : (
    From<FromClauseT, AliasedTableT>
) {
    assertBeforeFromClause(fromClause);
    assertValidCurrentJoinBase(fromClause, aliasedTable);

    const result : From<FromClauseT, AliasedTableT> = {
        outerQueryJoins : fromClause.outerQueryJoins,
        currentJoins : [
            JoinUtil.fromAliasedTable(aliasedTable, false, JoinType.FROM, [], [])
        ],
    };
    return result;
}

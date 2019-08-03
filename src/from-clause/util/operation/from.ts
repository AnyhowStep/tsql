import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {BeforeFromClause} from "../helper-type";
import {JoinUtil, JoinType} from "../../../join";
import {assertBeforeFromClause} from "../predicate";

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
    aliasedTable : AliasedTableT
) : (
    From<FromClauseT, AliasedTableT>
) {
    assertBeforeFromClause(fromClause);

    const result : From<FromClauseT, AliasedTableT> = {
        outerQueryJoins : fromClause.outerQueryJoins,
        currentJoins : [
            JoinUtil.fromAliasedTable(aliasedTable, false, JoinType.FROM, [], [])
        ],
    };
    return result;
}

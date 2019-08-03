import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {BeforeFromClause} from "../helper-type";
import {JoinUtil, JoinType} from "../../../join";

export type From<
    FromClauseT extends BeforeFromClause,
    AliasedTableT extends IAliasedTable
> = (
    IFromClause<{
        parentJoins : FromClauseT["parentJoins"],
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
    const result : From<FromClauseT, AliasedTableT> = {
        parentJoins : fromClause.parentJoins,
        currentJoins : [
            JoinUtil.fromAliasedTable(aliasedTable, false, JoinType.FROM, [], [])
        ],
    };
    return result;
}

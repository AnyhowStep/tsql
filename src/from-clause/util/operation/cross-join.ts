import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {AfterFromClause} from "../../helper-type";
import {JoinUtil, JoinType, JoinArrayUtil} from "../../../join";

export type CrossJoin<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> = (
    IFromClause<{
        parentJoins : FromClauseT["parentJoins"],
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
    aliasedTable : AliasedTableT
) : (
    CrossJoin<FromClauseT, AliasedTableT>
) {
    const result : CrossJoin<FromClauseT, AliasedTableT> = {
        parentJoins : fromClause.parentJoins,
        currentJoins : JoinArrayUtil.append(
            fromClause.currentJoins,
            JoinUtil.fromAliasedTable(aliasedTable, false, JoinType.CROSS, [], [])
        ),
    };
    return result;
}

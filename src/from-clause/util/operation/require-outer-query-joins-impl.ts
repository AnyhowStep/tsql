import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {JoinUtil, JoinType, JoinArrayUtil, IJoin} from "../../../join";
import {AssertValidOuterQueryJoins, assertValidOuterQueryJoins} from "../predicate";

export type RequireOuterQueryJoinsImpl<
    FromClauseT extends IFromClause,
    NullableT extends boolean,
    AliasedTablesT extends readonly IAliasedTable[]
> = (
    AliasedTablesT[number] extends never ?
    FromClauseT :
    IFromClause<{
        outerQueryJoins : (
            FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
            JoinArrayUtil.Append<
                FromClauseT["outerQueryJoins"],
                JoinUtil.FromAliasedTable<AliasedTablesT[number], NullableT>
            > :
            readonly JoinUtil.FromAliasedTable<AliasedTablesT[number], NullableT>[]
        ),
        currentJoins : FromClauseT["currentJoins"],
    }>
);
export function requireOuterQueryJoinsImpl<
    FromClauseT extends IFromClause,
    NullableT extends boolean,
    AliasedTablesT extends readonly IAliasedTable[]
> (
    fromClause : FromClauseT,
    nullable : NullableT,
    ...aliasedTables : (
        & AliasedTablesT
        & AssertValidOuterQueryJoins<FromClauseT, AliasedTablesT>
    )
) : (
    RequireOuterQueryJoinsImpl<FromClauseT, NullableT, AliasedTablesT>
) {
    if (aliasedTables.length == 0) {
        return fromClause as RequireOuterQueryJoinsImpl<FromClauseT, NullableT, AliasedTablesT>;
    }

    assertValidOuterQueryJoins(fromClause, aliasedTables);

    const required = aliasedTables.map(aliasedTable => (
        JoinUtil.fromAliasedTable(
            aliasedTable,
            nullable,
            /**
             * The `JoinType` does not matter for outer query joins.
             */
            JoinType.FROM,
            /**
             * The columns don't matter, either.
             */
            [],
            []
        )
    ));
    const outerQueryJoins = (
        fromClause.outerQueryJoins == undefined ?
        required :
        JoinArrayUtil.append(
            fromClause.outerQueryJoins,
            ...required
        )
    );

    const result = {
        outerQueryJoins,
        currentJoins : fromClause.currentJoins,
    } as RequireOuterQueryJoinsImpl<FromClauseT, NullableT, AliasedTablesT>;
    return result;
}

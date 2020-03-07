import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {RequireOuterQueryJoinsImpl, requireOuterQueryJoinsImpl} from "./require-outer-query-joins-impl";
import {AssertValidOuterQueryJoins} from "../predicate";
import {JoinUtil} from "../../../join";

export type NewInstanceWithOuterQueryJoins<
    NullableT extends boolean,
    AliasedTablesT extends readonly IAliasedTable[]
> =
    IFromClause<{
        outerQueryJoins : readonly JoinUtil.FromAliasedTable<AliasedTablesT[number], NullableT>[],
        currentJoins : undefined,
    }>
;
export type RequireOuterQueryJoins<
    FromClauseT extends IFromClause,
    AliasedTablesT extends readonly IAliasedTable[]
> = (
    RequireOuterQueryJoinsImpl<FromClauseT, false, AliasedTablesT>
);
export function requireOuterQueryJoins<
    FromClauseT extends IFromClause,
    AliasedTablesT extends readonly IAliasedTable[]
> (
    fromClause : FromClauseT,
    ...aliasedTables : (
        & AliasedTablesT
        & AssertValidOuterQueryJoins<FromClauseT, AliasedTablesT>
    )
) : (
    RequireOuterQueryJoins<FromClauseT, AliasedTablesT>
) {
    return requireOuterQueryJoinsImpl<
        FromClauseT,
        false,
        AliasedTablesT
    >(
        fromClause,
        false,
        ...(aliasedTables as any)
    );
}

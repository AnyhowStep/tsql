import {IFromClause} from "../../from-clause";
import {IAliasedTable, AliasedTableArrayUtil} from "../../../aliased-table";
import {AssertNotInCurrentJoins, AssertNotInOuterQueryJoins} from "../predicate";
import {RequireOuterQueryJoinsImpl, requireOuterQueryJoinsImpl} from "./require-outer-query-joins-impl";

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
        & AssertNotInCurrentJoins<FromClauseT, AliasedTablesT[number]>
        & AssertNotInOuterQueryJoins<FromClauseT, AliasedTablesT[number]>
        & AliasedTableArrayUtil.AssertNoDuplicateTableAlias<AliasedTablesT>
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

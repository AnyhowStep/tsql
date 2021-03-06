import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {AssertValidOuterQueryJoins} from "../predicate";
import {RequireOuterQueryJoinsImpl, requireOuterQueryJoinsImpl} from "./require-outer-query-joins-impl";

export type RequireNullableOuterQueryJoins<
    FromClauseT extends IFromClause,
    AliasedTablesT extends readonly IAliasedTable[]
> = (
    RequireOuterQueryJoinsImpl<FromClauseT, true, AliasedTablesT>
);
export function requireNullableOuterQueryJoins<
    FromClauseT extends IFromClause,
    AliasedTablesT extends readonly IAliasedTable[]
> (
    fromClause : FromClauseT,
    ...aliasedTables : (
        & AliasedTablesT
        & AssertValidOuterQueryJoins<FromClauseT, AliasedTablesT>
    )
) : (
    RequireNullableOuterQueryJoins<FromClauseT, AliasedTablesT>
) {
    return requireOuterQueryJoinsImpl<
        FromClauseT,
        true,
        AliasedTablesT
    >(
        fromClause,
        true,
        ...(aliasedTables as any)
    );
}

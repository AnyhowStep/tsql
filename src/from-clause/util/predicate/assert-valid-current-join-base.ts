import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {AssertNotInCurrentJoins, assertNotInCurrentJoins} from "./assert-not-in-current-joins";
import {AssertNotInOuterQueryJoins, assertNotInOuterQueryJoins} from "./assert-not-in-outer-query-joins";

/**
 * These constraints are required, no matter what database.
 */
export type AssertValidCurrentJoinBase<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "tableAlias">
> = (
    & AssertNotInCurrentJoins<FromClauseT, AliasedTableT>
    & AssertNotInOuterQueryJoins<FromClauseT, AliasedTableT>
);
export function assertValidCurrentJoinBase (
    fromClause : IFromClause,
    aliasedTable : Pick<IAliasedTable, "tableAlias">
) {
    assertNotInCurrentJoins(fromClause, aliasedTable);
    assertNotInOuterQueryJoins(fromClause, aliasedTable);
}

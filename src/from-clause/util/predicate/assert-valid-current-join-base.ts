import {IFromClause} from "../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {AssertNotInCurrentJoins, assertNotInCurrentJoins} from "./assert-not-in-current-joins";
import {AssertNotInOuterQueryJoins, assertNotInOuterQueryJoins} from "./assert-not-in-outer-query-joins";
import {AllowedUsedRef, allowedUsedRef} from "./allowed-used-ref";
import {UsedRefUtil} from "../../../used-ref";

/**
 * These constraints are required, no matter what database.
 */
export type AssertValidCurrentJoinBase<
    FromClauseT extends IFromClause,
    AliasedTableT extends Pick<IAliasedTable, "alias"|"isLateral">
> = (
    & { usedRef : AllowedUsedRef<FromClauseT, AliasedTableT> }
    & AssertNotInCurrentJoins<FromClauseT, AliasedTableT>
    & AssertNotInOuterQueryJoins<FromClauseT, AliasedTableT>
);
export function assertValidCurrentJoinBase (
    fromClause : IFromClause,
    aliasedTable : Pick<IAliasedTable, "alias"|"isLateral"|"usedRef">
) {
    assertNotInCurrentJoins(fromClause, aliasedTable);
    assertNotInOuterQueryJoins(fromClause, aliasedTable);

    UsedRefUtil.assertAllowed(
        allowedUsedRef(fromClause, aliasedTable),
        aliasedTable.usedRef
    );
}

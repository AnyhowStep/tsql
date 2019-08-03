import {IFromClause} from "../../from-clause";
import {AssertNotInCurrentJoins, assertNotInCurrentJoins} from "./assert-not-in-current-joins";
import {AssertNotInOuterQueryJoins, assertNotInOuterQueryJoins} from "./assert-not-in-outer-query-joins";
import {AliasedTableArrayUtil, IAliasedTable} from "../../../aliased-table";

export type AssertValidOuterQueryJoins<
    FromClauseT extends IFromClause,
    AliasedTablesT extends readonly IAliasedTable[]
> = (
    & AssertNotInCurrentJoins<FromClauseT, AliasedTablesT[number]>
    & AssertNotInOuterQueryJoins<FromClauseT, AliasedTablesT[number]>
    & AliasedTableArrayUtil.AssertNoDuplicateTableAlias<AliasedTablesT>
);
export function assertValidOuterQueryJoins (
    fromClause : IFromClause,
    aliasedTables : readonly IAliasedTable[]
) {

    for (const aliasedTable of aliasedTables) {
        assertNotInCurrentJoins(fromClause, aliasedTable);
        assertNotInOuterQueryJoins(fromClause, aliasedTable);
    }
    AliasedTableArrayUtil.assertNoDuplicateTableAlias(aliasedTables);

}

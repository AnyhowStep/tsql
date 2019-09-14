import {IAliasedTable} from "../../../aliased-table";
import {FromClauseUtil} from "../../../from-clause";
import {IQuery} from "../../query";

export type AssertValidCurrentJoin<
    QueryT extends IQuery,
    AliasedTableT extends IAliasedTable
> = (
    & FromClauseUtil.AssertValidCurrentJoinBase<QueryT["fromClause"], AliasedTableT>
    /**
     * In MySQL 5.7, derived tables cannot reference parent query tables.
     * This is not a SQL limitation. It is a MySQL limitation.
     *
     * SQLite 3.28 and PostgreSQL 9.4 have no problems with it.
     * Gdi MySQL.
     */
    & FromClauseUtil.AssertNoUsedRef<AliasedTableT>
    /**
     * MySQL 5.7 does not support lateral derived tables.
     */
    & FromClauseUtil.AssertNotLateral<AliasedTableT>
);
export function assertValidJoinTarget (
    query : IQuery,
    aliasedTable : IAliasedTable
) {
    FromClauseUtil.assertValidCurrentJoinBase(query.fromClause, aliasedTable);
    FromClauseUtil.assertNoUsedRef(aliasedTable);
    FromClauseUtil.assertNotLateral(aliasedTable);
}

import {FromClauseUtil} from "../../../from-clause";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";

/**
 * https://stackoverflow.com/questions/59922428/portable-group-by-clause-rules/59922712#59922712
 *
 * 1. Aliased expressions in the `SELECT` clause **must not** be used in the `GROUP BY` clause
 *    + MySQL allows this
 * 2. Columns from outer queries **must not** be used in the `GROUP BY` clause
 *    + No databases allow this
 * 3. The `GROUP BY` clause **must not** contain non-column expressions
 *    + MySQL, PostgreSQL, SQLite, MS SQL Server all support this
 *    + This is not part of the SQL standard, however
 * 4. The `GROUP BY` clause **must not** be used without a `FROM` clause
 *    + A restriction of MySQL
 */
export type AllowedColumnIdentifierRef<
    FromClauseT extends FromClauseUtil.AfterFromClause
> =
    ColumnIdentifierRefUtil.FromJoinArray<FromClauseT["currentJoins"]>
;
export function allowedColumnIdentifierRef<
    FromClauseT extends FromClauseUtil.AfterFromClause
> (
    fromClause : FromClauseT
) : (
    AllowedColumnIdentifierRef<FromClauseT>
) {
    return ColumnIdentifierRefUtil.fromJoinArray<FromClauseT["currentJoins"]>(
        fromClause.currentJoins
    );
}

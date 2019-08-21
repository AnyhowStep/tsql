/**
 * @todo Revisit implementations/typedefs?
 *
 * Seems a little wasteful at the moment.
 * However, correctness > performance
 */
import {FromClauseUtil} from "../../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {ColumnRefUtil} from "../../../column-ref";
import {JoinUtil, JoinArrayUtil, JoinType} from "../../../join";
import {UsedRefUtil} from "../../../used-ref";

export type AllowedColumnRef<
    FromClauseT extends Pick<FromClauseUtil.AfterFromClause, "currentJoins">,
    AliasedTableT extends IAliasedTable
> =
    ColumnRefUtil.FromJoinArray<
        JoinArrayUtil.Append<
            FromClauseT["currentJoins"],
            /**
             * Inside the `ON` clause,
             * even if we are using a `LEFT` join,
             * the join is not considered `nullable`.
             *
             * At the time the `ON` clause is executed,
             * it is evaluated for each pair on the LHS and RHS of the join operator.
             *
             * ```sql
             *  FROM
             *      myTable
             *  LEFT JOIN
             *      otherTable
             *  ON
             *      --otherTable.column0 is not null
             *      myTable.column0 = otherTable.column0
             *  WHERE
             *      --otherTable.column0 may be null, because of the LEFT JOIN
             *      otherTable.column0 IS NOT NULL
             * ```
             */
            JoinUtil.FromAliasedTable<AliasedTableT, false>
        >
        //| FromClauseT["currentJoins"]
        //| JoinUtil.FromAliasedTable<AliasedTableT, false>[]
    >
;
export type AllowedUsedRef<
    FromClauseT extends Pick<FromClauseUtil.AfterFromClause, "currentJoins">,
    AliasedTableT extends IAliasedTable
> =
    UsedRefUtil.FromJoinArray<
        JoinArrayUtil.Append<
            FromClauseT["currentJoins"],
            /**
             * Inside the `ON` clause,
             * even if we are using a `LEFT` join,
             * the join is not considered `nullable`.
             *
             * At the time the `ON` clause is executed,
             * it is evaluated for each pair on the LHS and RHS of the join operator.
             *
             * ```sql
             *  FROM
             *      myTable
             *  LEFT JOIN
             *      otherTable
             *  ON
             *      --otherTable.column0 is not null
             *      myTable.column0 = otherTable.column0
             *  WHERE
             *      --otherTable.column0 may be null, because of the LEFT JOIN
             *      otherTable.column0 IS NOT NULL
             * ```
             */
            JoinUtil.FromAliasedTable<AliasedTableT, false>
        >
        //| FromClauseT["currentJoins"]
        //| JoinUtil.FromAliasedTable<AliasedTableT, false>[]
    >
;
export function allowedColumnRef<
    FromClauseT extends Pick<FromClauseUtil.AfterFromClause, "currentJoins">,
    AliasedTableT extends IAliasedTable
> (
    fromClause : FromClauseT,
    aliasedTable : AliasedTableT
) : (
    AllowedColumnRef<FromClauseT, AliasedTableT>
) {
    return ColumnRefUtil.fromJoinArray(
        JoinArrayUtil.append<
            FromClauseT["currentJoins"],
            JoinUtil.FromAliasedTable<AliasedTableT, false>
        >(
            fromClause.currentJoins,
            JoinUtil.fromAliasedTable(
                aliasedTable,
                false,
                /**
                 * We don't care about the `JoinType` for this temporary array
                 */
                JoinType.FROM,
                /**
                 * We don't care about the `ON` clause either
                 */
                undefined
            )
        )
    );
}

export function allowedUsedRef<
    FromClauseT extends Pick<FromClauseUtil.AfterFromClause, "currentJoins">,
    AliasedTableT extends IAliasedTable
> (
    fromClause : FromClauseT,
    aliasedTable : AliasedTableT
) : (
    AllowedUsedRef<FromClauseT, AliasedTableT>
) {
    return UsedRefUtil.fromJoinArray(
        JoinArrayUtil.append<
            FromClauseT["currentJoins"],
            JoinUtil.FromAliasedTable<AliasedTableT, false>
        >(
            fromClause.currentJoins,
            JoinUtil.fromAliasedTable(
                aliasedTable,
                false,
                /**
                 * We don't care about the `JoinType` for this temporary array
                 */
                JoinType.FROM,
                /**
                 * We don't care about the `ON` clause either
                 */
                undefined
            )
        )
    );
}

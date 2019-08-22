/**
 * @todo Revisit implementations/typedefs?
 *
 * Seems a little wasteful at the moment.
 * However, correctness > performance
 */
import {FromClauseUtil} from "../../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {ColumnRefUtil} from "../../../column-ref";
import {JoinUtil, JoinArrayUtil, JoinType, IJoin} from "../../../join";
import {UsedRefUtil} from "../../../used-ref";

export type AllowedColumnRef<
    FromClauseT extends FromClauseUtil.AfterFromClause,
    AliasedTableT extends IAliasedTable
> =
    ColumnRefUtil.FromJoinArray<
        JoinArrayUtil.Append<
            JoinArrayUtil.Append<
                FromClauseT["currentJoins"],
                (
                    FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
                    FromClauseT["outerQueryJoins"][number] :
                    never
                )
            >,
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
    >
;
export type AllowedUsedRef<
    FromClauseT extends FromClauseUtil.AfterFromClause,
    AliasedTableT extends IAliasedTable
> =
    UsedRefUtil.FromJoinArray<
        JoinArrayUtil.Append<
            JoinArrayUtil.Append<
                FromClauseT["currentJoins"],
                (
                    FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
                    FromClauseT["outerQueryJoins"][number] :
                    never
                )
            >,
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
    >
;
export function allowedColumnRef<
    FromClauseT extends FromClauseUtil.AfterFromClause,
    AliasedTableT extends IAliasedTable
> (
    fromClause : FromClauseT,
    aliasedTable : AliasedTableT
) : (
    AllowedColumnRef<FromClauseT, AliasedTableT>
) {
    return ColumnRefUtil.fromJoinArray(
        JoinArrayUtil.append<
            JoinArrayUtil.Append<
                FromClauseT["currentJoins"],
                (
                    FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
                    FromClauseT["outerQueryJoins"][number] :
                    never
                )
            >,
            JoinUtil.FromAliasedTable<AliasedTableT, false>
        >(
            JoinArrayUtil.append<
                FromClauseT["currentJoins"],
                (
                    FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
                    FromClauseT["outerQueryJoins"][number] :
                    never
                )
            >(
                fromClause.currentJoins,
                ...(
                    fromClause.outerQueryJoins == undefined ?
                    [] :
                    fromClause.outerQueryJoins
                ) as (
                    FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
                    FromClauseT["outerQueryJoins"][number] :
                    never
                )[]
            ),
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
    FromClauseT extends FromClauseUtil.AfterFromClause,
    AliasedTableT extends IAliasedTable
> (
    fromClause : FromClauseT,
    aliasedTable : AliasedTableT
) : (
    AllowedUsedRef<FromClauseT, AliasedTableT>
) {
    /**
     * @todo Investigate assignability
     */
    return UsedRefUtil.fromJoinArray(
        JoinArrayUtil.append<
            JoinArrayUtil.Append<
                FromClauseT["currentJoins"],
                (
                    FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
                    FromClauseT["outerQueryJoins"][number] :
                    never
                )
            >,
            JoinUtil.FromAliasedTable<AliasedTableT, false>
        >(
            JoinArrayUtil.append<
                FromClauseT["currentJoins"],
                (
                    FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
                    FromClauseT["outerQueryJoins"][number] :
                    never
                )
            >(
                fromClause.currentJoins,
                ...(
                    fromClause.outerQueryJoins == undefined ?
                    [] :
                    fromClause.outerQueryJoins
                ) as (
                    FromClauseT["outerQueryJoins"] extends readonly IJoin[] ?
                    FromClauseT["outerQueryJoins"][number] :
                    never
                )[]
            ),
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
    ) as AllowedUsedRef<FromClauseT, AliasedTableT>;
}

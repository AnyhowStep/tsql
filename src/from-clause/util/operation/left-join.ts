import {IFromClause} from "../../from-clause";
import {AfterFromClause} from "../helper-type";
import {IAliasedTable} from "../../../aliased-table";
import {assertAfterFromClause, assertValidCurrentJoinBase, AssertValidCurrentJoinBase} from "../predicate";
import {JoinArrayUtil, JoinUtil, JoinType} from "../../../join";
import {AssertNonUnion} from "../../../type-util";
import {OnDelegate, OnClauseUtil} from "../../../on-clause";
import {BuiltInExpr} from "../../../raw-expr";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type LeftJoinImpl<
    AliasedTableT extends IAliasedTable,
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> =
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : JoinArrayUtil.Append<
            CurrentJoinsT,
            JoinUtil.FromAliasedTable<AliasedTableT, true>
        >,
    }>
;
export type LeftJoin<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> =
    LeftJoinImpl<
        AliasedTableT,
        FromClauseT["outerQueryJoins"],
        FromClauseT["currentJoins"]
    >
;

/**
 * ```sql
 *  LEFT JOIN
 *      myTable
 *  ON
 *      --condition
 * ```
 */
export function leftJoin<
    FromClauseT extends AfterFromClause,
    AliasedTableT extends IAliasedTable,
    RawOnClauseT extends BuiltInExpr<boolean>
> (
    fromClause : FromClauseT,
    aliasedTable : (
        & AliasedTableT
        & AssertNonUnion<AliasedTableT>
        & AssertValidCurrentJoinBase<FromClauseT, AliasedTableT>
    ),
    onDelegate : OnDelegate<FromClauseT, AliasedTableT, RawOnClauseT>
) : (
    LeftJoin<FromClauseT, AliasedTableT>
) {
    assertAfterFromClause(fromClause);
    assertValidCurrentJoinBase(fromClause, aliasedTable);

    const result : LeftJoin<FromClauseT, AliasedTableT> = {
        outerQueryJoins : fromClause.outerQueryJoins,
        currentJoins : JoinArrayUtil.append(
            fromClause.currentJoins,
            JoinUtil.fromAliasedTable<AliasedTableT, true>(
                aliasedTable,
                true,
                JoinType.LEFT,
                OnClauseUtil.on<
                    FromClauseT,
                    AliasedTableT,
                    RawOnClauseT
                >(
                    fromClause,
                    aliasedTable,
                    onDelegate
                )
            )
        ),
    };
    return result;
}

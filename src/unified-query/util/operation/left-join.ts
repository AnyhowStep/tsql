import {IAliasedTable} from "../../../aliased-table";
import {FromClauseUtil} from "../../../from-clause";
import * as TypeUtil from "../../../type-util";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {OnDelegate, OnClauseUtil} from "../../../on-clause";
import {Query} from "../../query-impl";
import {assertValidJoinTarget, AssertValidCurrentJoin} from "../predicate";
import {AfterFromClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type LeftJoinImpl<
    AliasedTableT extends IAliasedTable,
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    CompoundQueryClauseT extends AfterFromClause["compoundQueryClause"],
    CompoundQueryLimitClauseT extends AfterFromClause["compoundQueryLimitClause"],
    MapDelegateT extends AfterFromClause["mapDelegate"],
    GroupByClauseT extends AfterFromClause["groupByClause"],
> =
    Query<{
        fromClause : FromClauseUtil.LeftJoin<FromClauseT, AliasedTableT>,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
        groupByClause : GroupByClauseT,
    }>
;
export type LeftJoin<QueryT extends AfterFromClause, AliasedTableT extends IAliasedTable> =
    LeftJoinImpl<
        AliasedTableT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
;
export function leftJoin<
    QueryT extends AfterFromClause,
    AliasedTableT extends IAliasedTable,
    RawOnClauseT extends BuiltInExpr_NonAggregate<boolean>
> (
    query : QueryT,
    aliasedTable : (
        & AliasedTableT
        & TypeUtil.AssertNonUnion<AliasedTableT>
        & AssertValidCurrentJoin<QueryT, AliasedTableT>
    ),
    onDelegate : OnDelegate<
        QueryT["fromClause"],
        AliasedTableT,
        (
            & RawOnClauseT
            & OnClauseUtil.AssertNoOuterQueryUsedRef<QueryT["fromClause"], RawOnClauseT>
        )
    >
) : (
    LeftJoin<QueryT, AliasedTableT>
) {
    assertValidJoinTarget(query, aliasedTable);

    const {
        //fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
        mapDelegate,
        groupByClause,
    } = query;

    const result : LeftJoin<QueryT, AliasedTableT> = new Query(
        {
            fromClause : FromClauseUtil.leftJoin<
                QueryT["fromClause"],
                AliasedTableT,
                RawOnClauseT
            >(
                query.fromClause,
                aliasedTable,
                columns => {
                    const rawOnClause : RawOnClauseT = onDelegate(columns);
                    /**
                     * @todo Investigate assignability
                     */
                    const result = rawOnClause as (
                        & RawOnClauseT
                        & OnClauseUtil.AssertValidUsedRef<QueryT["fromClause"], AliasedTableT, RawOnClauseT>
                        //& OnClauseUtil.AssertNoOuterQueryUsedRef<QueryT["fromClause"], RawOnClauseT>
                    );
                    OnClauseUtil.assertNoOuterQueryUsedRef(query.fromClause, result);
                    return result;
                }
            ),
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
            groupByClause,
        },
        query
    );
    return result;
}

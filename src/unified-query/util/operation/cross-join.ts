import {IAliasedTable} from "../../../aliased-table";
import {FromClauseUtil} from "../../../from-clause";
import * as TypeUtil from "../../../type-util";
import {Query} from "../../query-impl";
import {assertValidJoinTarget, AssertValidCurrentJoin} from "../predicate";
import {AfterFromClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type CrossJoinImpl<
    AliasedTableT extends IAliasedTable,
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    CompoundQueryClauseT extends AfterFromClause["compoundQueryClause"],
    CompoundQueryLimitClauseT extends AfterFromClause["compoundQueryLimitClause"],
    MapDelegateT extends AfterFromClause["mapDelegate"],
    GroupByClauseT extends AfterFromClause["groupByClause"],
> = (
    Query<{
        fromClause : FromClauseUtil.CrossJoin<FromClauseT, AliasedTableT>,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
        groupByClause : GroupByClauseT,
    }>
);
export type CrossJoin<QueryT extends AfterFromClause, AliasedTableT extends IAliasedTable> = (
    CrossJoinImpl<
        AliasedTableT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
);
export function crossJoin<
    QueryT extends AfterFromClause,
    AliasedTableT extends IAliasedTable
> (
    query : QueryT,
    aliasedTable : (
        & AliasedTableT
        & TypeUtil.AssertNonUnion<AliasedTableT>
        & AssertValidCurrentJoin<QueryT, AliasedTableT>
    )
) : (
    CrossJoin<QueryT, AliasedTableT>
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

    const result : CrossJoin<QueryT, AliasedTableT> = new Query(
        {
            fromClause : FromClauseUtil.crossJoin<
                QueryT["fromClause"],
                AliasedTableT
            >(
                query.fromClause,
                aliasedTable
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

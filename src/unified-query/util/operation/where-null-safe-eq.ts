import * as tm from "type-mapping";
import {FromClauseUtil} from "../../../from-clause";
import {ColumnUtil} from "../../../column";
import {Query} from "../../query-impl";
import {AfterFromClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereNullSafeEqImpl<
    ColumnT extends ColumnUtil.FromJoinArray<
        FromClauseT["currentJoins"]
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>|null,
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    CompoundQueryClauseT extends AfterFromClause["compoundQueryClause"],
    CompoundQueryLimitClauseT extends AfterFromClause["compoundQueryLimitClause"],
    MapDelegateT extends AfterFromClause["mapDelegate"],
    GroupByClauseT extends AfterFromClause["groupByClause"],
> = (
    Query<{
        fromClause : FromClauseUtil.WhereNullSafeEq<FromClauseT, ColumnT, ValueT>,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
        groupByClause : GroupByClauseT,
    }>
);
export type WhereNullSafeEq<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.FromJoinArray<
        QueryT["fromClause"]["currentJoins"]
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>|null
> = (
    WhereNullSafeEqImpl<
        ColumnT,
        ValueT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
);
export function whereNullSafeEq<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.FromJoinArray<
        QueryT["fromClause"]["currentJoins"]
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>|null
> (
    query : QueryT,
    /**
     * This construction effectively makes it impossible for `WhereNullSafeEqDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    ...args : (
        ColumnT extends ColumnUtil.FromJoinArray<QueryT["fromClause"]["currentJoins"]> ?
        [
            FromClauseUtil.WhereNullSafeEqDelegate<QueryT["fromClause"], ColumnT>,
            ValueT
        ] :
        never
    )
) : (
    WhereNullSafeEq<QueryT, ColumnT, ValueT>
) {
    const {
        fromClause,
        whereClause,
    } = FromClauseUtil.whereNullSafeEq<
        QueryT["fromClause"],
        ColumnT,
        ValueT
    >(
        query.fromClause,
        query.whereClause,
        ...args
    );

    const {
        //fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
        mapDelegate,
        groupByClause,

        havingClause,
        orderByClause,
        compoundQueryOrderByClause,
        isDistinct,
    } = query;

    const result : WhereNullSafeEq<QueryT, ColumnT, ValueT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
            groupByClause,
        },
        {
            whereClause,
            havingClause,
            orderByClause,
            compoundQueryOrderByClause,
            isDistinct,
        }
    );
    return result;
}

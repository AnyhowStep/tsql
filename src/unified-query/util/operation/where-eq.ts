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
export type WhereEqImpl<
    ColumnT extends ColumnUtil.ExtractNonNullable<
        ColumnUtil.FromJoinArray<
            FromClauseT["currentJoins"]
        >
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>,
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    CompoundQueryClauseT extends AfterFromClause["compoundQueryClause"],
    CompoundQueryLimitClauseT extends AfterFromClause["compoundQueryLimitClause"],
    MapDelegateT extends AfterFromClause["mapDelegate"],
> = (
    Query<{
        fromClause : FromClauseUtil.WhereEq<FromClauseT, ColumnT, ValueT>,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
    }>
);
export type WhereEq<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNonNullable<
        ColumnUtil.FromJoinArray<
            QueryT["fromClause"]["currentJoins"]
        >
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>
> = (
    WhereEqImpl<
        ColumnT,
        ValueT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"]
    >
);
export function whereEq<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNonNullable<
        ColumnUtil.FromJoinArray<
            QueryT["fromClause"]["currentJoins"]
        >
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>
> (
    query : QueryT,
    /**
     * This construction effectively makes it impossible for `WhereEqDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    ...args : (
        ColumnT extends ColumnUtil.ExtractNonNullable<
            ColumnUtil.FromJoinArray<QueryT["fromClause"]["currentJoins"]>
        > ?
        [
            FromClauseUtil.WhereEqDelegate<QueryT["fromClause"], ColumnT>,
            ValueT
        ] :
        never
    )
) : (
    WhereEq<QueryT, ColumnT, ValueT>
) {
    const {
        fromClause,
        whereClause,
    } = FromClauseUtil.whereEq<
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

    const result : WhereEq<QueryT, ColumnT, ValueT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
        },
        {
            whereClause,
            groupByClause,
            havingClause,
            orderByClause,
            compoundQueryOrderByClause,
            isDistinct,
        }
    );
    return result;
}

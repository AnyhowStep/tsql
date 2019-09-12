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
export type WhereIsNotNullImpl<
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<
            FromClauseT["currentJoins"]
        >
    >,
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    UnionClauseT extends AfterFromClause["compoundQueryClause"],
    UnionLimitClauseT extends AfterFromClause["compoundQueryLimitClause"],
> = (
    Query<{
        fromClause : FromClauseUtil.WhereIsNotNull<FromClauseT, ColumnT>,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : UnionClauseT,
        compoundQueryLimitClause : UnionLimitClauseT,
    }>
);
export type WhereIsNotNull<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<
            QueryT["fromClause"]["currentJoins"]
        >
    >
> = (
    WhereIsNotNullImpl<
        ColumnT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"]
    >
);
export function whereIsNotNull<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<
            QueryT["fromClause"]["currentJoins"]
        >
    >
> (
    query : QueryT,
    whereIsNotNullDelegate : FromClauseUtil.WhereIsNotNullDelegate<
        QueryT["fromClause"],
        ColumnT
    >
) : (
    WhereIsNotNull<QueryT, ColumnT>
) {
    const {
        fromClause,
        whereClause,
    } = FromClauseUtil.whereIsNotNull<
        QueryT["fromClause"],
        ColumnT
    >(
        query.fromClause,
        query.whereClause,
        whereIsNotNullDelegate
    );

    const {
        //fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,

        groupByClause,
        havingClause,
        orderByClause,
        unionOrderByClause,
    } = query;

    const result : WhereIsNotNull<QueryT, ColumnT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
        },
        {
            whereClause,
            groupByClause,
            havingClause,
            orderByClause,
            unionOrderByClause,
        }
    );
    return result;
}

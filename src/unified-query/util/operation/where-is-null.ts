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
export type WhereIsNullImpl<
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<
            FromClauseT["currentJoins"]
        >
    >,
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    UnionClauseT extends AfterFromClause["unionClause"],
    UnionLimitClauseT extends AfterFromClause["unionLimitClause"],
> = (
    Query<{
        fromClause : FromClauseUtil.WhereIsNull<FromClauseT, ColumnT>,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        unionClause : UnionClauseT,
        unionLimitClause : UnionLimitClauseT,
    }>
);
export type WhereIsNull<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<
            QueryT["fromClause"]["currentJoins"]
        >
    >
> = (
    WhereIsNullImpl<
        ColumnT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["unionClause"],
        QueryT["unionLimitClause"]
    >
);
export function whereIsNull<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<
            QueryT["fromClause"]["currentJoins"]
        >
    >
> (
    query : QueryT,
    whereIsNullDelegate : FromClauseUtil.WhereIsNullDelegate<
        QueryT["fromClause"],
        ColumnT
    >
) : (
    WhereIsNull<QueryT, ColumnT>
) {
    const {
        fromClause,
        whereClause,
    } = FromClauseUtil.whereIsNull<
        QueryT["fromClause"],
        ColumnT
    >(
        query.fromClause,
        query.whereClause,
        whereIsNullDelegate
    );

    const {
        //fromClause,
        selectClause,

        limitClause,

        unionClause,
        unionLimitClause,

        groupByClause,
        havingClause,
        orderByClause,
    } = query;

    const result : WhereIsNull<QueryT, ColumnT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            unionClause,
            unionLimitClause,
        },
        {
            whereClause,
            groupByClause,
            havingClause,
            orderByClause,
        }
    );
    return result;
}

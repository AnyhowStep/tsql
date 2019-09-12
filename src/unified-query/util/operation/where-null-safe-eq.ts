import * as tm from "type-mapping";
import {FromClauseUtil} from "../../../from-clause";
import {ColumnUtil} from "../../../column";
import {PrimitiveExpr} from "../../../primitive-expr";
import {Query} from "../../query-impl";
import {AfterFromClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereNullSafeEqImpl<
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<
            FromClauseT["currentJoins"]
        >,
        PrimitiveExpr
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>|null,
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    UnionClauseT extends AfterFromClause["unionClause"],
    UnionLimitClauseT extends AfterFromClause["unionLimitClause"],
> = (
    Query<{
        fromClause : FromClauseUtil.WhereNullSafeEq<FromClauseT, ColumnT, ValueT>,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        unionClause : UnionClauseT,
        unionLimitClause : UnionLimitClauseT,
    }>
);
export type WhereNullSafeEq<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<
            QueryT["fromClause"]["currentJoins"]
        >,
        PrimitiveExpr
    >,
    ValueT extends tm.OutputOf<ColumnT["mapper"]>|null
> = (
    WhereNullSafeEqImpl<
        ColumnT,
        ValueT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["unionClause"],
        QueryT["unionLimitClause"]
    >
);
export function whereNullSafeEq<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractWithType<
        ColumnUtil.FromJoinArray<
            QueryT["fromClause"]["currentJoins"]
        >,
        PrimitiveExpr
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
        ColumnT extends ColumnUtil.ExtractWithType<
            ColumnUtil.FromJoinArray<QueryT["fromClause"]["currentJoins"]>,
            PrimitiveExpr
        > ?
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

        unionClause,
        unionLimitClause,

        groupByClause,
        havingClause,
        orderByClause,
        unionOrderByClause,
    } = query;

    const result : WhereNullSafeEq<QueryT, ColumnT, ValueT> = new Query(
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
            unionOrderByClause,
        }
    );
    return result;
}

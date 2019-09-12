import {FromClauseUtil} from "../../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {Query} from "../../query-impl";
import {AfterFromClause, Correlated} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqOuterQueryPrimaryKeyImpl<
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    UnionClauseT extends AfterFromClause["unionClause"],
    UnionLimitClauseT extends AfterFromClause["unionLimitClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        unionClause : UnionClauseT,
        unionLimitClause : UnionLimitClauseT,
    }>
);
export type WhereEqOuterQueryPrimaryKey<
    QueryT extends AfterFromClause
> = (
    WhereEqOuterQueryPrimaryKeyImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["unionClause"],
        QueryT["unionLimitClause"]
    >
);
export function whereEqOuterQueryPrimaryKey<
    QueryT extends (Correlated & AfterFromClause),
    SrcT extends QueryT["fromClause"]["currentJoins"][number],
    DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<QueryT["fromClause"]["outerQueryJoins"], SrcT["columns"]>
> (
    query : QueryT,
    /**
     * This construction effectively makes it impossible for
     * `WhereEqOuterQueryPrimaryKeySrcDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    srcDelegate : (
        SrcT extends QueryT["fromClause"]["currentJoins"][number] ?
        FromClauseUtil.WhereEqOuterQueryPrimaryKeySrcDelegate<QueryT["fromClause"], SrcT> :
        never
    ),
    dstDelegate : (
        FromClauseUtil.WhereEqOuterQueryPrimaryKeyDstDelegate<
            QueryT["fromClause"],
            SrcT,
            DstT
        >
    )
) : (
    WhereEqOuterQueryPrimaryKey<QueryT>
) {
    const {
        fromClause,
        whereClause,
    } = FromClauseUtil.whereEqOuterQueryPrimaryKey<
        QueryT["fromClause"],
        SrcT,
        DstT
    >(
        query.fromClause,
        query.whereClause,
        srcDelegate,
        dstDelegate
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

    const result : WhereEqOuterQueryPrimaryKey<QueryT> = new Query(
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

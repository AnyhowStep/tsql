import {FromClauseUtil} from "../../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {PrimaryKey_NonUnion} from "../../../primary-key";
import {Query} from "../../query-impl";
import {AfterFromClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqPrimaryKeyImpl<
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    UnionClauseT extends AfterFromClause["compoundQueryClause"],
    UnionLimitClauseT extends AfterFromClause["unionLimitClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : UnionClauseT,
        unionLimitClause : UnionLimitClauseT,
    }>
);
export type WhereEqPrimaryKey<
    QueryT extends AfterFromClause
> = (
    WhereEqPrimaryKeyImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["unionLimitClause"]
    >
);
export function whereEqPrimaryKey<
    QueryT extends AfterFromClause,
    TableT extends JoinArrayUtil.ExtractWithPrimaryKey<QueryT["fromClause"]["currentJoins"]>
> (
    query : QueryT,
    /**
     * This construction effectively makes it impossible for `WhereEqPrimaryKeyDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    ...args : (
        TableT extends JoinArrayUtil.ExtractWithPrimaryKey<QueryT["fromClause"]["currentJoins"]> ?
        [
            FromClauseUtil.WhereEqPrimaryKeyDelegate<QueryT["fromClause"], TableT>,
            PrimaryKey_NonUnion<TableT>
        ] :
        never
    )
) : (
    WhereEqPrimaryKey<QueryT>
) {
    const {
        fromClause,
        whereClause,
    } = FromClauseUtil.whereEqPrimaryKey<
        QueryT["fromClause"],
        TableT
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
        unionLimitClause,

        groupByClause,
        havingClause,
        orderByClause,
        unionOrderByClause,
    } = query;

    const result : WhereEqPrimaryKey<QueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
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
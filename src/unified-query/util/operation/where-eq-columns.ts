import {FromClauseUtil} from "../../../from-clause";
import {PartialRow_NonUnion} from "../../../partial-row";
import {Query} from "../../query-impl";
import {AfterFromClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqColumnsImpl<
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
export type WhereEqColumns<
    QueryT extends AfterFromClause
> = (
    WhereEqColumnsImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["unionClause"],
        QueryT["unionLimitClause"]
    >
);
export function whereEqColumns<
    QueryT extends AfterFromClause,
    TableT extends QueryT["fromClause"]["currentJoins"][number]
> (
    query : QueryT,
    /**
     * This construction effectively makes it impossible for `WhereEqColumnsDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    ...args : (
        TableT extends QueryT["fromClause"]["currentJoins"][number] ?
        [
            FromClauseUtil.WhereEqColumnsDelegate<QueryT["fromClause"], TableT>,
            PartialRow_NonUnion<TableT>
        ] :
        never
    )
) : (
    WhereEqColumns<QueryT>
) {
    const {
        fromClause,
        whereClause,
    } = FromClauseUtil.whereEqColumns<
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

        unionClause,
        unionLimitClause,

        groupByClause,
        havingClause,
        orderByClause,
    } = query;

    const result : WhereEqColumns<QueryT> = new Query(
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

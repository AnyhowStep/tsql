import {FromClauseUtil} from "../../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {SuperKey_NonUnion} from "../../../super-key";
import {Query} from "../../query-impl";
import {AfterFromClause} from "../helper-type";
import {eqSuperKey} from "../../../expr-library";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqSuperKeyImpl<
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
export type WhereEqSuperKey<
    QueryT extends AfterFromClause
> = (
    WhereEqSuperKeyImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["unionClause"],
        QueryT["unionLimitClause"]
    >
);
export function whereEqSuperKey<
    QueryT extends AfterFromClause,
    TableT extends JoinArrayUtil.ExtractWithCandidateKey<QueryT["fromClause"]["currentJoins"]>
> (
    query : QueryT,
    /**
     * This construction effectively makes it impossible for `WhereEqSuperKeyDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    ...args : (
        TableT extends JoinArrayUtil.ExtractWithCandidateKey<QueryT["fromClause"]["currentJoins"]> ?
        [
            FromClauseUtil.WhereEqSuperKeyDelegate<QueryT["fromClause"], TableT>,
            SuperKey_NonUnion<TableT>
        ] :
        never
    )
) : (
    WhereEqSuperKey<QueryT>
) {
    const {
        fromClause,
        whereClause,
    } = FromClauseUtil.whereEqSuperKey<
        QueryT["fromClause"],
        TableT
    >(
        query.fromClause,
        query.whereClause,
        eqSuperKey,
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

    const result : WhereEqSuperKey<QueryT> = new Query(
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

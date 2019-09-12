import {FromClauseUtil} from "../../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {CandidateKey_NonUnion} from "../../../candidate-key";
import * as TypeUtil from "../../../type-util";
import {Query} from "../../query-impl";
import {AfterFromClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqCandidateKeyImpl<
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    UnionClauseT extends AfterFromClause["compoundQueryClause"],
    CompoundQueryLimitClauseT extends AfterFromClause["compoundQueryLimitClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : UnionClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
    }>
);
export type WhereEqCandidateKey<
    QueryT extends AfterFromClause
> = (
    WhereEqCandidateKeyImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"]
    >
);
export function whereEqCandidateKey<
    QueryT extends AfterFromClause,
    TableT extends JoinArrayUtil.ExtractWithCandidateKey<QueryT["fromClause"]["currentJoins"]>
> (
    query : QueryT,
    /**
     * This construction effectively makes it impossible for `WhereEqCandidateKeyDelegate<>`
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
            FromClauseUtil.WhereEqCandidateKeyDelegate<QueryT["fromClause"], TableT>,
            TypeUtil.StrictUnion<CandidateKey_NonUnion<TableT>>
        ] :
        never
    )
) : (
    WhereEqCandidateKey<QueryT>
) {
    const {
        fromClause,
        whereClause,
    } = FromClauseUtil.whereEqCandidateKey<
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
        compoundQueryLimitClause,

        groupByClause,
        havingClause,
        orderByClause,
        compoundQueryOrderByClause,
    } = query;

    const result : WhereEqCandidateKey<QueryT> = new Query(
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
            compoundQueryOrderByClause,
        }
    );
    return result;
}

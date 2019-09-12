import {IAliasedTable} from "../../../aliased-table";
import {FromClauseUtil} from "../../../from-clause";
import * as TypeUtil from "../../../type-util";
import {TableUtil, ITable} from "../../../table";
import * as ExprLib from "../../../expr-library";
import {Query} from "../../query-impl";
import {assertValidJoinTarget, AssertValidCurrentJoin} from "../predicate";
import {AfterFromClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type InnerJoinUsingCandidateKeyImpl<
    AliasedTableT extends IAliasedTable,
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    UnionClauseT extends AfterFromClause["compoundQueryClause"],
    UnionLimitClauseT extends AfterFromClause["unionLimitClause"],
> =
    Query<{
        fromClause : FromClauseUtil.InnerJoin<FromClauseT, AliasedTableT>,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : UnionClauseT,
        unionLimitClause : UnionLimitClauseT,
    }>
;
export type InnerJoinUsingCandidateKey<QueryT extends AfterFromClause, AliasedTableT extends IAliasedTable> =
    InnerJoinUsingCandidateKeyImpl<
        AliasedTableT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["unionLimitClause"]
    >
;
export function innerJoinUsingCandidateKey<
    QueryT extends AfterFromClause,
    SrcT extends QueryT["fromClause"]["currentJoins"][number],
    DstT extends ITable,
    SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
> (
    query : QueryT,
    srcDelegate : FromClauseUtil.InnerJoinUsingCandidateKeySrcDelegate<QueryT["fromClause"], SrcT>,
    aliasedTable : (
        & DstT
        & TypeUtil.AssertNonUnion<DstT>
        & AssertValidCurrentJoin<QueryT, DstT>
    ),
    eqCandidateKeyofTableDelegate : ExprLib.EqCandidateKeyOfTableDelegate<SrcT, DstT, SrcColumnsT>
) : (
    InnerJoinUsingCandidateKey<QueryT, DstT>
) {
    assertValidJoinTarget(query, aliasedTable);

    const {
        //fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        unionLimitClause,
    } = query;

    const result : InnerJoinUsingCandidateKey<QueryT, DstT> = new Query(
        {
            fromClause : FromClauseUtil.innerJoinUsingCandidateKey<
                QueryT["fromClause"],
                SrcT,
                DstT,
                SrcColumnsT
            >(
                query.fromClause,
                srcDelegate,
                aliasedTable,
                eqCandidateKeyofTableDelegate
            ),
            selectClause,

            limitClause,

            compoundQueryClause,
            unionLimitClause,
        },
        query
    );
    return result;
}

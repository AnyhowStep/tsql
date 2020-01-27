import {LimitClauseUtil} from "../../../../limit-clause";
import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type CompoundQueryOffsetBigIntImpl<
    OffsetT extends bigint,
    FromClauseT extends IQuery["fromClause"],
    SelectClauseT extends IQuery["selectClause"],
    LimitClauseT extends IQuery["limitClause"],
    CompoundQueryClauseT extends IQuery["compoundQueryClause"],
    CompoundQueryLimitClauseT extends IQuery["compoundQueryLimitClause"],
    MapDelegateT extends IQuery["mapDelegate"],
    GroupByClauseT extends IQuery["groupByClause"],
> =
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : LimitClauseUtil.OffsetBigInt<
            CompoundQueryLimitClauseT,
            OffsetT
        >,

        mapDelegate : MapDelegateT,
        groupByClause : GroupByClauseT,
    }>
;
export type CompoundQueryOffsetBigInt<
    QueryT extends IQuery,
    OffsetT extends bigint
> =
    CompoundQueryOffsetBigIntImpl<
        OffsetT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
;

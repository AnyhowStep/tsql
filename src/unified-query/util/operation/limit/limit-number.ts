import {LimitClauseUtil} from "../../../../limit-clause";
import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type LimitNumberImpl<
    FromClauseT extends IQuery["fromClause"],
    SelectClauseT extends IQuery["selectClause"],
    LimitClauseT extends IQuery["limitClause"],
    UnionClauseT extends IQuery["compoundQueryClause"],
    UnionLimitClauseT extends IQuery["unionLimitClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseUtil.LimitNumber<
            LimitClauseT
        >,

        compoundQueryClause : UnionClauseT,
        unionLimitClause : UnionLimitClauseT,
    }>
);
export type LimitNumber<
    QueryT extends IQuery
> = (
    LimitNumberImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["unionLimitClause"]
    >
);

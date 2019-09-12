import {IQueryBase} from "../../query-base";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {LimitClause} from "../../../limit-clause";

/**
 * To guarantee a query returns one row only,
 * you cannot have a `FROM` clause or `UNION` clause.
 */
export type OneRow = (
    IQueryBase<{
        fromClause : FromClauseUtil.BeforeFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitClause|undefined,

        compoundQueryClause : undefined,
        unionLimitClause : LimitClause|undefined,
    }>
);

import {IQueryBase} from "../../query-base";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {LimitData} from "../../../limit";

/**
 * To guarantee a query returns one row only,
 * you cannot have a `FROM` clause or `UNION` clause.
 */
export type OneRow = (
    IQueryBase<{
        fromClause : FromClauseUtil.BeforeFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitData|undefined,

        unionClause : undefined,
        unionLimitClause : LimitData|undefined,
    }>
);

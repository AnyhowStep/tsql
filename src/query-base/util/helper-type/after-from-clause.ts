import {IQueryBase} from "../../query-base";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {CompoundQueryClause} from "../../../compound-query-clause";
import {LimitClause} from "../../../limit-clause";

export type AfterFromClause = (
    IQueryBase<{
        fromClause : FromClauseUtil.AfterFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitClause|undefined,

        compoundQueryClause : CompoundQueryClause|undefined,
        unionLimitClause : LimitClause|undefined,
    }>
);

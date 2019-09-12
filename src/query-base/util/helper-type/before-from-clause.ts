import {IQueryBase} from "../../query-base";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {CompoundQueryClause} from "../../../compound-query-clause";
import {LimitClause} from "../../../limit-clause";

export type BeforeFromClause = (
    IQueryBase<{
        fromClause : FromClauseUtil.BeforeFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitClause|undefined,

        unionClause : CompoundQueryClause|undefined,
        unionLimitClause : LimitClause|undefined,
    }>
);

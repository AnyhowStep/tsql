import {IQueryBase} from "../../query-base";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {UnionClause} from "../../../union-clause";
import {LimitClause} from "../../../limit-clause";

export type AfterFromClause = (
    IQueryBase<{
        fromClause : FromClauseUtil.AfterFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitClause|undefined,

        unionClause : UnionClause|undefined,
        unionLimitClause : LimitClause|undefined,
    }>
);

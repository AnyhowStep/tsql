import {IQueryBase} from "../../query-base";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {UnionClause} from "../../../union-clause";
import {LimitClause} from "../../../limit";

export type BeforeFromClause = (
    IQueryBase<{
        fromClause : FromClauseUtil.BeforeFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitClause|undefined,

        unionClause : UnionClause|undefined,
        unionLimitClause : LimitClause|undefined,
    }>
);

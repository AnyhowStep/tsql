import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {UnionClause} from "../../../union-clause";
import {LimitClause} from "../../../limit";

export type AfterSelectClause = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : SelectClause,

        limitClause : LimitClause|undefined,

        unionClause : UnionClause|undefined,
        unionLimitClause : LimitClause|undefined,
    }>
);

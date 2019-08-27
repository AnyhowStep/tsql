import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {UnionClause} from "../../../union-clause";
import {LimitClause} from "../../../limit";

export type AfterUnionClause = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitClause|undefined,

        unionClause : UnionClause,
        unionLimitClause : LimitClause|undefined,
    }>
);

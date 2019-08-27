import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {UnionClause} from "../../../union-clause";
import {LimitClause} from "../../../limit-clause";

export type BeforeSelectClause = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : undefined,

        limitClause : LimitClause|undefined,

        unionClause : UnionClause|undefined,
        unionLimitClause : LimitClause|undefined,
    }>
);

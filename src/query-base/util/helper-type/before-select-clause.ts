import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {UnionClause} from "../../../union-clause";
import {LimitData} from "../../../limit";

export type BeforeSelectClause = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : undefined,

        limitClause : LimitData|undefined,

        unionClause : UnionClause|undefined,
        unionLimitClause : LimitData|undefined,
    }>
);

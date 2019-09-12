import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {CompoundQueryClause} from "../../../compound-query-clause";
import {LimitClause} from "../../../limit-clause";

export type BeforeSelectClause = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : undefined,

        limitClause : LimitClause|undefined,

        unionClause : CompoundQueryClause|undefined,
        unionLimitClause : LimitClause|undefined,
    }>
);

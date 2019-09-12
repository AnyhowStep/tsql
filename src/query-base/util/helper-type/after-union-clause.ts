import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {CompoundQueryClause} from "../../../compound-query-clause";
import {LimitClause} from "../../../limit-clause";

export type AfterUnionClause = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitClause|undefined,

        unionClause : CompoundQueryClause,
        unionLimitClause : LimitClause|undefined,
    }>
);

import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {CompoundQueryClause} from "../../../compound-query-clause";
import {LimitClause} from "../../../limit-clause";

export type AfterSelectClause = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : SelectClause,

        limitClause : LimitClause|undefined,

        compoundQueryClause : CompoundQueryClause|undefined,
        compoundQueryLimitClause : LimitClause|undefined,
    }>
);

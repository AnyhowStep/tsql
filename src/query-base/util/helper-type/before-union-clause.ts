import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {LimitClause} from "../../../limit";

export type BeforeUnionClause = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitClause|undefined,

        unionClause : undefined,
        unionLimitClause : LimitClause|undefined,
    }>
);

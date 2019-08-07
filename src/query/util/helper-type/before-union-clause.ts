import {IQuery} from "../../query";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {LimitData} from "../../../limit";

export type BeforeUnionClause = (
    IQuery<{
        fromClause : IFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitData|undefined,

        unionClause : undefined,
        unionLimitClause : LimitData|undefined,
    }>
);

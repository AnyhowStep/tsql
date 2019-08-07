import {IQuery} from "../../query";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {UnionClause} from "../../../union-clause";
import {LimitData} from "../../../limit";

export type AfterSelectClause = (
    IQuery<{
        fromClause : IFromClause,
        selectClause : SelectClause,

        limitClause : LimitData|undefined,

        unionClause : UnionClause|undefined,
        unionLimitClause : LimitData|undefined,
    }>
);

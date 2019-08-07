import {IQuery} from "../../query";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {UnionClause} from "../../../union-clause";
import {LimitData} from "../../../limit";

export type AfterUnionClause = (
    IQuery<{
        fromClause : IFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitData|undefined,

        unionClause : UnionClause,
        unionLimitClause : LimitData|undefined,
    }>
);

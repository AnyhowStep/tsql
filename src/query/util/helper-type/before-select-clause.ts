import {IQuery} from "../../query";
import {IFromClause} from "../../../from-clause";
import {UnionClause} from "../../../union-clause";
import {LimitData} from "../../../limit";

export type BeforeSelectClause = (
    IQuery<{
        fromClause : IFromClause,
        selectClause : undefined,

        limitClause : LimitData|undefined,

        unionClause : UnionClause|undefined,
        unionLimitClause : LimitData|undefined,
    }>
);

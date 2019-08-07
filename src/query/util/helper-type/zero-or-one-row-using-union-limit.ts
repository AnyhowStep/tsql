import {IQuery} from "../../query";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {UnionClause} from "../../../union-clause";
import {LimitData} from "../../../limit";

export type ZeroOrOneRowUsingUnionLimit = (
    IQuery<{
        fromClause : IFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitData|undefined,

        unionClause : UnionClause|undefined,
        /**
         * If `LIMIT` occurs within a subquery and also is applied in the outer query,
         * the outermost `LIMIT` takes precedence.
         *
         * https://dev.mysql.com/doc/refman/8.0/en/select.html
         */
        unionLimitClause : {
            readonly maxRowCount : 0|1|0n|1n,
            readonly offset : number|bigint,
        },
    }>
);

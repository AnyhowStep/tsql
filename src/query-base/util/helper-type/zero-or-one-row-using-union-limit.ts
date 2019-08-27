import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {UnionClause} from "../../../union-clause";
import {LimitClause} from "../../../limit-clause";

export type ZeroOrOneRowUsingUnionLimit = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitClause|undefined,

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

import {IQuery} from "../../query";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";

export type ZeroOrOneRowUsingLimit = (
    IQuery<{
        fromClause : IFromClause,
        selectClause : SelectClause|undefined,

        limitClause : {
            readonly maxRowCount : 0|1|0n|1n,
            readonly offset : number|bigint,
        },

        /**
         * `UNION` clause not allowed
         */
        unionClause : undefined,
        unionLimitClause : undefined,
    }>
);

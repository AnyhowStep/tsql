import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";

export type ZeroOrOneRowUsingLimit = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : SelectClause|undefined,

        limitClause : {
            readonly maxRowCount : 0n|1n,
            readonly offset : bigint,
        },

        /**
         * `UNION` clause not allowed
         */
        compoundQueryClause : undefined,
        compoundQueryLimitClause : undefined,
    }>
);

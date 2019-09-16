import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {MapDelegate} from "../../../map-delegate";

export type ZeroOrOneRowUsingLimit = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : SelectClause|undefined,

        limitClause : {
            readonly maxRowCount : 0n|1n,
            readonly offset : bigint,
        },

        /**
         * `COMPOUND QUERY` clause not allowed
         */
        compoundQueryClause : undefined,
        compoundQueryLimitClause : undefined,

        mapDelegate : MapDelegate|undefined,
    }>
);

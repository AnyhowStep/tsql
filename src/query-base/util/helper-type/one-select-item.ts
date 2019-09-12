import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {CompoundQueryClause} from "../../../compound-query-clause";
import {LimitClause} from "../../../limit-clause";
import {AnonymousSingleValueSelectItem} from "../../../select-item";

export type OneSelectItem<TypeT> = (
    IQueryBase<{
        fromClause : IFromClause,
        /**
         * A 1-tuple containing a single-value select item
         */
        selectClause : [AnonymousSingleValueSelectItem<TypeT>],

        limitClause : LimitClause|undefined,

        unionClause : CompoundQueryClause|undefined,
        unionLimitClause : LimitClause|undefined,
    }>
);

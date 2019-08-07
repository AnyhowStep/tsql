import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {UnionClause} from "../../../union-clause";
import {LimitData} from "../../../limit";
import {AnonymousSingleValueSelectItem} from "../../../select-item";

export type OneSelectItem<TypeT> = (
    IQueryBase<{
        fromClause : IFromClause,
        /**
         * A 1-tuple containing a single-value select item
         */
        selectClause : [AnonymousSingleValueSelectItem<TypeT>],

        limitClause : LimitData|undefined,

        unionClause : UnionClause|undefined,
        unionLimitClause : LimitData|undefined,
    }>
);

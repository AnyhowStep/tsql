import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {CompoundQueryClause} from "../../../compound-query-clause";
import {LimitClause} from "../../../limit-clause";
import {AnonymousSingleValueSelectItem} from "../../../select-item";

/**
 * @todo Rename to `ScalarQuery`?
 * The SQL standard seems to use that name.
 *
 * The number of names in the `SELECT` clause is called the **degree** of the query.
 * A scalar query has a degree of **one**.
 */
export type OneSelectItem<TypeT> = (
    IQueryBase<{
        fromClause : IFromClause,
        /**
         * A 1-tuple containing a single-value select item
         */
        selectClause : [AnonymousSingleValueSelectItem<TypeT>],

        limitClause : LimitClause|undefined,

        compoundQueryClause : CompoundQueryClause|undefined,
        compoundQueryLimitClause : LimitClause|undefined,
    }>
);

import {OneSelectItem, ZeroOrOneRow, OneRow} from "../helper-type";
import {SelectItemUtil} from "../../../select-item";

/**
 * The type of the select item in the query.
 *
 * @todo Better name
 */
export type TypeOfSelectItem<QueryT extends OneSelectItem<unknown>> =
    SelectItemUtil.TypeOf<QueryT["selectClause"][0]>
;

/**
 * The type of the **entire** query, when used as an expression.
 */
export type TypeOf<QueryT extends OneSelectItem<unknown> & ZeroOrOneRow> = (
    QueryT extends OneRow ?
    TypeOfSelectItem<QueryT> :
    null|TypeOfSelectItem<QueryT>
);

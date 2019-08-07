import {OneSelectItem, ZeroOrOneRow, OneRow} from "../helper-type";
import {SelectItemUtil} from "../../../select-item";

export type TypeOf<QueryT extends OneSelectItem<unknown> & ZeroOrOneRow> = (
    QueryT extends OneRow ?
    SelectItemUtil.TypeOf<QueryT["selectClause"][0]> :
    null|SelectItemUtil.TypeOf<QueryT["selectClause"][0]>
);

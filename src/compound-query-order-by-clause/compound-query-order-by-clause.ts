import {SortDirection} from "../sort-direction";
import {IColumn} from "../column";

export type CompoundQueryOrder = readonly [IColumn, SortDirection];
export type CompoundQueryOrderByClause = readonly CompoundQueryOrder[];

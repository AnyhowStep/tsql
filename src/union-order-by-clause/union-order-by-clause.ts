import {SortDirection} from "../sort-direction";
import {IColumn} from "../column";

export type UnionOrder = readonly [IColumn, SortDirection];
export type UnionOrderByClause = readonly UnionOrder[];

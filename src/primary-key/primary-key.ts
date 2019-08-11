import {TableWithPrimaryKey} from "../table";
import {TypeMapUtil} from "../type-map";
import {UnionToIntersection} from "type-mapping/dist/type-util";

/**
 * Assumes `TableT` is not a union.
 *
 * If it is a union, use `PrimaryKey_Output/Input<U>` instead.
 *
 * -----
 *
 * Also assumes `TableT["columns"]` and `TableT["primaryKey"]` are not unions.
 * They really shouldn't be unions.
 * + Why does your table not have a definite set of columns?
 *   Is it Schrödinger's columns?
 * + Why does your table not have a definite primary key?
 *   Is it Schrödinger's primary key?
 */
export type PrimaryKey_NonUnion<TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">> = (
    TypeMapUtil.FromColumnMap<
        Pick<TableT["columns"], TableT["primaryKey"][number]>
    >
);

/**
 * Works properly, even when `TableT` is a union.
 *
 * Will return a union of primary keys.
 * Meant for output/read/covariant positions.
 */
export type PrimaryKey_Output<TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">> = (
    TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey"> ?
    PrimaryKey_NonUnion<TableT> :
    never
);

/**
 * Works properly, even when `TableT` is a union.
 *
 * Will return an intersection of primary keys.
 * Meant for input/write/contravariant positions.
 */
export type PrimaryKey_Input<TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">> = (
    UnionToIntersection<
        PrimaryKey_Output<TableT>
    >
);

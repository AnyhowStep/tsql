import {ColumnMap} from "../../../column-map";
import {WithPrimaryKey} from "../helper-type";
import {TableUtil} from "../../../table";

/**
 * Returns `true` if all primary key columns of `JoinT`
 * are **null-safe** comparable with columns in `ColumnMapT` that have the same name
 *
 * Assumes `JoinT` is not a union
 */
export type HasNullSafeComparablePrimaryKey<
    JoinT extends Pick<WithPrimaryKey, "columns"|"primaryKey">,
    ColumnMapT extends ColumnMap
> = (
    TableUtil.HasNullSafeComparablePrimaryKey<JoinT, ColumnMapT>
);

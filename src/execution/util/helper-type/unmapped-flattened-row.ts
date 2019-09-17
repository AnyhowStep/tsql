import {QueryBaseUtil} from "../../../query-base";
import {UnmappedRow} from "./unmapped-row";
import {TypeMapUtil} from "../../../type-map";
import {ColumnUtil} from "../../../column";
import {CanFlattenUnmappedRow} from "../predicate";

/**
 * Contrary to its name, it does not actually flatten the row all the time.
 * If it can be flattened "safely", it will be flattened.
 *
 * Otherwise, it will not be flattened.
 */
export type UnmappedFlattenedRow<
    QueryT extends Pick<QueryBaseUtil.AfterSelectClause, "selectClause"|"fromClause">
> =
    CanFlattenUnmappedRow<QueryT> extends true ?
    TypeMapUtil.FromColumnArray<
        ColumnUtil.FromSelectClause<QueryT["selectClause"]>[]
    > :
    UnmappedRow<QueryT>
;

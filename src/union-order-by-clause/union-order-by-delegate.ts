import {SelectClause} from "../select-clause";
import {ColumnRefUtil} from "../column-ref";
import {ColumnUtil} from "../column";
import * as CompoundQueryOrderByClauseUtil from "./util";
import {SortDirection} from "../sort-direction";

/**
 * @todo Move this to `util`
 */
type ValidUnionSortExpr<
    SelectClauseT extends SelectClause
> =
    | ColumnUtil.FromColumnRef<CompoundQueryOrderByClauseUtil.AllowedColumnRef<SelectClauseT>>
;

export type CompoundQueryOrderByDelegate<
    SelectClauseT extends SelectClause
> = (
    (
        columns : ColumnRefUtil.TryFlatten<
            CompoundQueryOrderByClauseUtil.AllowedColumnRef<SelectClauseT>
        >
    ) => (
        readonly (
            | ValidUnionSortExpr<SelectClauseT>
            | readonly [ValidUnionSortExpr<SelectClauseT>, SortDirection]
        )[]
    )
);

import {SelectClause} from "../select-clause";
import {ColumnRefUtil} from "../column-ref";
import {ColumnUtil} from "../column";
import * as UnionOrderByClauseUtil from "./util";
import {SortDirection} from "../sort-direction";

/**
 * @todo Move this to `util`
 */
type ValidUnionSortExpr<
    SelectClauseT extends SelectClause
> =
    | ColumnUtil.FromColumnRef<UnionOrderByClauseUtil.AllowedColumnRef<SelectClauseT>>
;

export type UnionOrderByDelegate<
    SelectClauseT extends SelectClause
> = (
    (
        columns : ColumnRefUtil.TryFlatten<
            UnionOrderByClauseUtil.AllowedColumnRef<SelectClauseT>
        >
    ) => (
        readonly (
            | ValidUnionSortExpr<SelectClauseT>
            | readonly [ValidUnionSortExpr<SelectClauseT>, SortDirection]
        )[]
    )
);

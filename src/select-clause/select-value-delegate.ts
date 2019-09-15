import {IFromClause} from "../from-clause";
import {ColumnRefUtil} from "../column-ref";
import {SelectClause} from "./select-clause";
import * as SelectClauseUtil from "./util";
import {AnyRawExpr} from "../raw-expr";

export type SelectValueDelegate<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined,
    RawExprT extends AnyRawExpr
> =
    (
        columns : ColumnRefUtil.TryFlatten<
            SelectClauseUtil.AllowedColumnRef<FromClauseT>
        >
    ) => (
        RawExprT
        & SelectClauseUtil.AssertValidUsedRef<
            FromClauseT,
            SelectClauseUtil.ValueFromRawExpr<RawExprT>
        >
        & SelectClauseUtil.AssertValidColumnIdentifier<
            SelectClauseT,
            SelectClauseUtil.ValueFromRawExpr<RawExprT>
        >
    )
;

import {IFromClause} from "../from-clause";
import {SelectClause} from "./select-clause";
import * as SelectClauseUtil from "./util";
import {AnyBuiltInExpr} from "../built-in-expr";
import {SelectDelegateColumns} from "./select-delegate";
import {Identity} from "../type-util";

export type SelectValueDelegateReturnType<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined,
    BuiltInExprT extends AnyBuiltInExpr
> =
    Identity<
        & BuiltInExprT
        & SelectClauseUtil.AssertValidUsedRef<
            FromClauseT,
            SelectClauseUtil.ValueFromBuiltInExpr<BuiltInExprT>
        >
        & SelectClauseUtil.AssertValidColumnIdentifier<
            SelectClauseT,
            SelectClauseUtil.ValueFromBuiltInExpr<BuiltInExprT>
        >
    >
;
export type SelectValueDelegate<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined,
    BuiltInExprT extends AnyBuiltInExpr
> =
    (
        columns : SelectDelegateColumns<FromClauseT>
    ) => SelectValueDelegateReturnType<FromClauseT, SelectClauseT, BuiltInExprT>
;

import {IFromClause} from "../from-clause";
import {SelectClause} from "./select-clause";
import * as SelectClauseUtil from "./util";
import {AnyRawExpr} from "../raw-expr";
import {SelectDelegateColumns} from "./select-delegate";
import {Identity} from "../type-util";

export type SelectValueDelegateReturnType<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined,
    RawExprT extends AnyRawExpr
> =
    Identity<
        & RawExprT
        & SelectClauseUtil.AssertValidUsedRef<
            FromClauseT,
            SelectClauseUtil.ValueFromRawExpr<RawExprT>
        >
        & SelectClauseUtil.AssertValidColumnIdentifier<
            SelectClauseT,
            SelectClauseUtil.ValueFromRawExpr<RawExprT>
        >
    >
;
export type SelectValueDelegate<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined,
    RawExprT extends AnyRawExpr
> =
    (
        columns : SelectDelegateColumns<FromClauseT>
    ) => SelectValueDelegateReturnType<FromClauseT, SelectClauseT, RawExprT>
;

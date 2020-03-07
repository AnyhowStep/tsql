import * as tm from "type-mapping";
import {ILog} from "../../log";
import {latest} from "./latest";
import {Expr, ExprUtil} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";
import {AnyBuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {FromClauseUtil} from "../../../from-clause";
import {SelectValueDelegate} from "../../../select-clause";

export type LatestValue<
    LogT extends ILog,
    BuiltInExprT extends AnyBuiltInExpr
> = (
    Expr<{
        mapper : tm.SafeMapper<
            | null
            | BuiltInExprUtil.TypeOf<BuiltInExprT>
        >,
        usedRef : UsedRefUtil.FromColumnMap<LogT["ownerTable"]["columns"]>,
        isAggregate : false,
    }>
);

export interface LatestValueSelectValueDelegate<
    LogT extends ILog,
    BuiltInExprT extends AnyBuiltInExpr
> extends SelectValueDelegate<
    FromClauseUtil.From<
        FromClauseUtil.NewInstanceWithOuterQueryJoins<
            false,
            [LogT["ownerTable"]]
        >,
        LogT["logTable"]
    >,
    undefined,
    BuiltInExprT
> {

}

export function latestValue<
    LogT extends ILog,
    BuiltInExprT extends AnyBuiltInExpr
> (
    log : LogT,
    selectValueDelegate : LatestValueSelectValueDelegate<LogT, BuiltInExprT>
) : (
    LatestValue<LogT, AnyBuiltInExpr>
) {
    return ExprUtil.fromBuiltInExpr(
        latest(log)
            .selectValue(selectValueDelegate as any)
    ) as any;
}

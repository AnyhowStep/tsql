import * as tm from "type-mapping";
import {ILog} from "../../log";
import {latest} from "./latest";
import {Expr, ExprUtil} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";
import {AnyBuiltInExpr, RawExprUtil} from "../../../raw-expr";
import {FromClauseUtil} from "../../../from-clause";
import {SelectValueDelegate} from "../../../select-clause";

export type LatestValue<
    LogT extends ILog,
    BuiltInExprT extends AnyBuiltInExpr
> = (
    Expr<{
        mapper : tm.SafeMapper<
            | null
            | RawExprUtil.TypeOf<BuiltInExprT>
        >,
        usedRef : UsedRefUtil.FromColumnMap<LogT["ownerTable"]["columns"]>,
    }>
);

export type LatestValueSelectValueDelegate<
    LogT extends ILog,
    BuiltInExprT extends AnyBuiltInExpr
> =
    SelectValueDelegate<
        FromClauseUtil.From<
            FromClauseUtil.RequireOuterQueryJoins<
                FromClauseUtil.NewInstance,
                [LogT["ownerTable"]]
            >,
            LogT["logTable"]
        >,
        undefined,
        BuiltInExprT
    >
;

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

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
    RawExprT extends AnyBuiltInExpr
> = (
    Expr<{
        mapper : tm.SafeMapper<
            | null
            | RawExprUtil.TypeOf<RawExprT>
        >,
        usedRef : UsedRefUtil.FromColumnMap<LogT["ownerTable"]["columns"]>,
    }>
);

export type LatestValueSelectValueDelegate<
    LogT extends ILog,
    RawExprT extends AnyBuiltInExpr
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
        RawExprT
    >
;

export function latestValue<
    LogT extends ILog,
    RawExprT extends AnyBuiltInExpr
> (
    log : LogT,
    selectValueDelegate : LatestValueSelectValueDelegate<LogT, RawExprT>
) : (
    LatestValue<LogT, AnyBuiltInExpr>
) {
    return ExprUtil.fromRawExpr(
        latest(log)
            .selectValue(selectValueDelegate as any)
    ) as any;
}

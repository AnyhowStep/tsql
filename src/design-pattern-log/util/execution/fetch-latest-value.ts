import {ILog} from "../../log";
import {PrimaryKey_Input} from "../../../primary-key";
import {latestByPrimaryKey} from "./latest-by-primary-key";
import {ExecutionUtil, SelectConnection} from "../../../execution";
import {FromClauseUtil} from "../../../from-clause";
import {AnyBuiltInExpr, RawExprUtil} from "../../../raw-expr";
import {SelectValueDelegate} from "../../../select-clause";

export type FetchLatestValue<BuiltInExprT extends AnyBuiltInExpr> =
    ExecutionUtil.FetchValuePromise<
        RawExprUtil.TypeOf<BuiltInExprT>
    >
;
export type FetchLatestValueSelectValueDelegate<
    LogT extends ILog,
    BuiltInExprT extends AnyBuiltInExpr
> =
    SelectValueDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            LogT["logTable"]
        >,
        undefined,
        BuiltInExprT
    >
;

export function fetchLatestValue<
    LogT extends ILog,
    BuiltInExprT extends AnyBuiltInExpr
> (
    log : LogT,
    connection : SelectConnection,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>,
    selectValueDelegate : FetchLatestValueSelectValueDelegate<LogT, BuiltInExprT>
) : (
    FetchLatestValue<AnyBuiltInExpr>
) {
    const result : (
        ExecutionUtil.FetchValuePromise<any>
    ) = latestByPrimaryKey(log, primaryKey)
        .selectValue(selectValueDelegate as any)
        .fetchValue(connection);
    return result;
}

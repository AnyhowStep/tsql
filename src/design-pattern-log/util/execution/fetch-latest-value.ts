import {ILog} from "../../log";
import {PrimaryKey_Input} from "../../../primary-key";
import {latestByPrimaryKey} from "./latest-by-primary-key";
import {ExecutionUtil, SelectConnection} from "../../../execution";
import {FromClauseUtil} from "../../../from-clause";
import {AnyBuiltInExpr, RawExprUtil} from "../../../raw-expr";
import {SelectValueDelegate} from "../../../select-clause";

export type FetchLatestValue<RawExprT extends AnyBuiltInExpr> =
    ExecutionUtil.FetchValuePromise<
        RawExprUtil.TypeOf<RawExprT>
    >
;
export type FetchLatestValueSelectValueDelegate<
    LogT extends ILog,
    RawExprT extends AnyBuiltInExpr
> =
    SelectValueDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            LogT["logTable"]
        >,
        undefined,
        RawExprT
    >
;

export function fetchLatestValue<
    LogT extends ILog,
    RawExprT extends AnyBuiltInExpr
> (
    log : LogT,
    connection : SelectConnection,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>,
    selectValueDelegate : FetchLatestValueSelectValueDelegate<LogT, RawExprT>
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

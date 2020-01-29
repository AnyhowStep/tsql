import * as tm from "type-mapping";
import {ILog} from "../../log";
import * as ExprLib from "../../../expr-library";
import {exists} from "./exists";
import {ColumnMapUtil} from "../../../column-map";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";
import {latest} from "./latest";
import {ColumnUtil} from "../../../column";
import {Expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";
import {Identity} from "../../../type-util";

export type LatestValueOrDefaultColumnMap<
    LogT extends ILog
> =
    Identity<{
        [columnAlias in LogT["trackedWithDefaultValue"][number]] : (
            LogT["logTable"]["columns"][columnAlias]
        )
    }>
;
export type LatestValueOrDefaultColumn<
    LogT extends ILog
> =
    ColumnUtil.FromColumnMap<
        LatestValueOrDefaultColumnMap<LogT>
    >
;

export type LatestValueOrDefaultSelectValueDelegate<
    LogT extends ILog,
    ColumnT extends LatestValueOrDefaultColumn<LogT>
> =
    (
        columns : LatestValueOrDefaultColumnMap<LogT>
    ) => ColumnT
;

export type LatestValueOrDefault<
    LogT extends ILog,
    ColumnT extends LatestValueOrDefaultColumn<LogT>
> = (
    Expr<{
        mapper : tm.SafeMapper<
            ReturnType<ColumnT["mapper"]>
        >,
        usedRef : UsedRefUtil.FromColumnMap<LogT["ownerTable"]["columns"]>,
        isAggregate : false,
    }>
);

export function latestValueOrDefault<
    LogT extends ILog,
    ColumnT extends LatestValueOrDefaultColumn<LogT>
> (
    log : LogT,
    selectValueDelegate : LatestValueOrDefaultSelectValueDelegate<LogT, ColumnT>
) : (
    LatestValueOrDefault<LogT, ColumnT>
) {
    const columns = ColumnMapUtil.pick(
        log.logTable.columns,
        log.trackedWithDefaultValue
    );
    const column = selectValueDelegate(columns as any);
    ColumnIdentifierMapUtil.assertHasColumnIdentifier(columns, column);

    if (tm.canOutputNull(column.mapper)) {
        /**
         * It is possible for a row to exist but the value is `NULL`.
         * Especially when the column is nullable.
         */
        return ExprLib.if(
            exists(log),
            latest(log)
                .selectValue(() => column as any),
            log.trackedDefaults[column.columnAlias]
        ) as any;
    } else {
        /**
         * Column is not nullable, we should never have `NULL`
         * unless it's because a row does not exist.
         */
        return ExprLib.coalesce(
            latest(log)
                .selectValue(() => column as any),
            log.trackedDefaults[column.columnAlias] as any
        ) as any;
    }
}

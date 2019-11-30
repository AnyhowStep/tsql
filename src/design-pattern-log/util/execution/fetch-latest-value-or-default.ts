import {ILog} from "../../log";
import {PrimaryKey_Input} from "../../../primary-key";
import {IsolableSelectConnection} from "../../../execution";
import {ColumnUtil} from "../../../column";
import {fetchLatestValue} from "./fetch-latest-value";
import {ColumnMapUtil} from "../../../column-map";
import {TableUtil} from "../../../table";
import * as ExprLib from "../../../expr-library";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";
import {Identity} from "../../../type-util";
import {DataTypeUtil} from "../../../data-type";

export type FetchLatestValueOrDefaultColumnMap<
    LogT extends ILog
> =
    Identity<{
        [columnAlias in LogT["trackedWithDefaultValue"][number]] : (
            LogT["logTable"]["columns"][columnAlias]
        )
    }>
;
export type FetchLatestValueOrDefaultColumn<
    LogT extends ILog
> =
    ColumnUtil.FromColumnMap<
        FetchLatestValueOrDefaultColumnMap<LogT>
    >
;

export type FetchLatestValueOrDefaultSelectValueDelegate<
    LogT extends ILog,
    ColumnT extends FetchLatestValueOrDefaultColumn<LogT>
> =
    (
        columns : FetchLatestValueOrDefaultColumnMap<LogT>
    ) => ColumnT
;

export async function fetchLatestValueOrDefault<
    LogT extends ILog,
    ColumnT extends FetchLatestValueOrDefaultColumn<LogT>
> (
    log : LogT,
    connection : IsolableSelectConnection,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>,
    selectValueDelegate : FetchLatestValueOrDefaultSelectValueDelegate<LogT, ColumnT>
) : (
    Promise<ReturnType<ColumnT["mapper"]>>
) {
    const columns = ColumnMapUtil.pick(
        log.logTable.columns,
        log.trackedWithDefaultValue
    );
    const column = selectValueDelegate(columns as any);
    ColumnIdentifierMapUtil.assertHasColumnIdentifier(columns, column);

    const latestValueOrUndefined = await fetchLatestValue<LogT, ColumnT>(
        log,
        connection,
        primaryKey,
        () => column as any
    ).orUndefined();
    if (latestValueOrUndefined !== undefined) {
        return latestValueOrUndefined;
    }

    return connection.transactionIfNotInOne(async (connection) => {
        //If the owner does not exist, there is no default value
        await TableUtil.assertExists(
            log.ownerTable,
            connection,
            () => ExprLib.eqPrimaryKey(
                log.ownerTable,
                primaryKey
            ) as any
        );
        return DataTypeUtil.evaluateCustomExpr(
            log.logTable.columns[column.columnAlias],
            connection,
            log.trackedDefaults[column.columnAlias]
        );
    });
}

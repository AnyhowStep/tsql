import {ILog} from "../../../log";
import {IsolableSelectConnection, ExecutionUtil} from "../../../../execution";
import {PrimaryKey_Input, PrimaryKeyUtil} from "../../../../primary-key";
import {CompileError} from "../../../../compile-error";
import {TableUtil} from "../../../../table";
import * as ExprLib from "../../../../expr-library";
import {QueryUtil} from "../../../../unified-query";
import {KeyUtil} from "../../../../key";
import {Identity} from "../../../../type-util";
import {ExprUtil} from "../../../../expr";

export type AssertAllTrackedHasDefaultValue<LogT extends ILog> =
    Exclude<
        LogT["tracked"][number],
        LogT["trackedWithDefaultValue"][number]
    > extends never ?
    unknown :
    CompileError<[
        Exclude<
            LogT["tracked"][number],
            LogT["trackedWithDefaultValue"][number]
        >,
        "do not have default values"
    ]>
;

export function assertAllTrackedHasDefaultValue (log : ILog) {
    if (!KeyUtil.isEqual(
        log.tracked,
        log.trackedWithDefaultValue
    )) {
        throw new Error(`Not all tracked columns have a default value`);
    }
}

export type DefaultRow<LogT extends ILog> =
    Identity<{
        readonly [columnAlias in (
            | LogT["ownerTable"]["primaryKey"][number]
            | LogT["trackedWithDefaultValue"][number]
            | LogT["copy"][number]
        )] : (
            TableUtil.ColumnType<
                LogT["logTable"],
                columnAlias
            >
        )
    }>
;

export async function fetchDefault<
    LogT extends ILog
> (
    log : LogT,// & AssertAllTrackedHasDefaultValue<LogT>,
    connection : IsolableSelectConnection,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>
) : Promise<DefaultRow<LogT>> {
    //assertAllTrackedHasDefaultValue(log);

    primaryKey = PrimaryKeyUtil.mapper(log.ownerTable)(
        `${log.ownerTable.alias} PRIMARY KEY`,
        primaryKey
    ) as any;

    return connection.transactionIfNotInOne(async (connection) : Promise<DefaultRow<LogT>> => {
        //If the owner does not exist, there is no default value
        await TableUtil.assertExists(
            log.ownerTable,
            connection,
            () => ExprLib.eqPrimaryKey(
                log.ownerTable,
                primaryKey
            ) as any
        );
        const copyDefaults = await log.copyDefaultsDelegate({
            ownerPrimaryKey : primaryKey,
            connection,
        });

        const trackedColumnAliases = Object.keys(log.trackedDefaults);
        const selectClause = trackedColumnAliases.map((trackedColumnAlias) => {
                const rawExprNoUsedRef = log.trackedDefaults[trackedColumnAlias];
                return ExprUtil.fromRawExpr(rawExprNoUsedRef as any).as(trackedColumnAlias);
            });
        const trackedDefaults = await ExecutionUtil.fetchOne(
            QueryUtil.newInstance()
                .select(() => selectClause as any) as any,
            connection
        );

        return {
            ...copyDefaults,
            ...trackedDefaults,
            ...primaryKey,
        } as DefaultRow<LogT>;
    })
}

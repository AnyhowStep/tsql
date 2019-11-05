import {ILog, LogData} from "../../log";
import {TableUtil} from "../../../table";
import {PrimitiveExprUtil} from "../../../primitive-expr";
import {Identity} from "../../../type-util";
import {IsolableSelectConnection} from "../../../execution";
import {PrimaryKey_Input, PrimaryKeyUtil} from "../../../primary-key";
import {RawExprNoUsedRef, RawExprUtil} from "../../../raw-expr";
import {UsedRefUtil} from "../../../used-ref";
import {LogMustSetTrackedDefaults} from "./06-set-tracked-defaults";

export type LogMustSetCopyDefaultsDelegateData =
    & Pick<
        LogData,
        | "logTable"
        | "ownerTable"
        | "tracked"
        | "doNotCopy"
        | "copy"
    >
    & Pick<
        ILog,
        | "newestOrder"
    >
;

export type CopyDefaults<
    DataT extends LogMustSetCopyDefaultsDelegateData
> =
    Identity<
        & {
            readonly [columnAlias in Extract<
                TableUtil.RequiredColumnAlias<DataT["logTable"]>,
                DataT["copy"][number]
            >] : (
                RawExprNoUsedRef<
                    TableUtil.ColumnType<DataT["logTable"], columnAlias>
                >
            )
        }
        & {
            readonly [columnAlias in Extract<
                TableUtil.OptionalColumnAlias<DataT["logTable"]>,
                DataT["copy"][number]
            >] : (
                /**
                 * Makes things more explicit by forcing `undefined`
                 */
                | undefined
                | RawExprNoUsedRef<
                    TableUtil.ColumnType<DataT["logTable"], columnAlias>
                >
            )
        }
    >
;

export type CopyDefaultsDelegate<
    DataT extends LogMustSetCopyDefaultsDelegateData
> =
    (
        args : {
            ownerPrimaryKey : PrimaryKey_Input<DataT["ownerTable"]>,
            connection : IsolableSelectConnection,
        }
    ) => Promise<CopyDefaults<DataT>>
;
export type SetCopyDefaultsDelegate<
    DataT extends LogMustSetCopyDefaultsDelegateData
> =
    LogMustSetTrackedDefaults<{
        logTable : DataT["logTable"];
        ownerTable : DataT["ownerTable"];
        newestOrder : DataT["newestOrder"];
        tracked : DataT["tracked"];
        doNotCopy : DataT["doNotCopy"];
        copy : DataT["copy"];
        copyDefaultsDelegate : ILog["copyDefaultsDelegate"];
    }>
;

export function setCopyDefaultsDelegate<
    DataT extends LogMustSetCopyDefaultsDelegateData
> (
    log : DataT,
    rawCopyDefaultsDelegate : CopyDefaultsDelegate<DataT>
) : (
    SetCopyDefaultsDelegate<
        DataT
    >
) {
    /**
     * Nothing is allowed
     */
    const allowedRef = UsedRefUtil.fromColumnRef({});

    const requiredColumnAliases = TableUtil.requiredColumnAlias(log.logTable)
        .filter(columnName => (
            log.copy.indexOf(columnName) >= 0
        ));
    const optionalColumnAliases = TableUtil.optionalColumnAlias(log.logTable)
        .filter(columnName => (
            log.copy.indexOf(columnName) >= 0
        ));

    const copyDefaults : CopyDefaultsDelegate<DataT> = async (args) => {
        const rawResult = rawCopyDefaultsDelegate({
            ...args,
            ownerPrimaryKey : PrimaryKeyUtil.mapper(log.ownerTable)(
                `${log.ownerTable.alias} PRIMARY KEY`,
                args.ownerPrimaryKey
            ) as any,
        });
        const result : any = {};
        for (const columnAlias of requiredColumnAliases) {
            const rawValue = rawResult[columnAlias];
            if (rawValue === undefined) {
                throw new Error(`Expected a value for ${log.logTable.alias}.${columnAlias}`);
            }
            const usedRef = RawExprUtil.usedRef(rawValue);
            UsedRefUtil.assertAllowed(allowedRef, usedRef);

            result[columnAlias] = (
                PrimitiveExprUtil.isPrimitiveExpr(rawValue) ?
                log.logTable.columns[columnAlias].mapper(
                    `${log.logTable.alias}.${columnAlias}`,
                    rawValue
                ) :
                rawValue
            );
        }
        for (const columnAlias of optionalColumnAliases) {
            const rawValue = rawResult[columnAlias];
            if (rawValue === undefined) {
                continue;
            }
            const usedRef = RawExprUtil.usedRef(rawValue);
            UsedRefUtil.assertAllowed(allowedRef, usedRef);

            result[columnAlias] = (
                PrimitiveExprUtil.isPrimitiveExpr(rawValue) ?
                log.logTable.columns[columnAlias].mapper(
                    `${log.logTable.alias}.${columnAlias}`,
                    rawValue
                ) :
                rawValue
            );
        }
        return result;
    };
    const {
        logTable,
        ownerTable,
        newestOrder,
        tracked,
        doNotCopy,
        copy,
    } = log;
    return new LogMustSetTrackedDefaults<{
        logTable : DataT["logTable"];
        ownerTable : DataT["ownerTable"];
        newestOrder : DataT["newestOrder"];
        tracked : DataT["tracked"];
        doNotCopy : DataT["doNotCopy"];
        copy : DataT["copy"];
        copyDefaultsDelegate : ILog["copyDefaultsDelegate"];
    }>({
        logTable,
        ownerTable,
        newestOrder,
        tracked,
        doNotCopy,
        copy,
        copyDefaultsDelegate : copyDefaults as () => Promise<unknown>,
    });
}

export class LogMustSetCopyDefaultsDelegate<DataT extends LogMustSetCopyDefaultsDelegateData> {
    readonly logTable : DataT["logTable"];
    readonly ownerTable : DataT["ownerTable"];
    readonly newestOrder : DataT["newestOrder"];
    readonly tracked : DataT["tracked"];
    readonly doNotCopy : DataT["doNotCopy"];
    readonly copy : DataT["copy"];

    constructor (data : DataT) {
        this.logTable = data.logTable;
        this.ownerTable = data.ownerTable;
        this.newestOrder = data.newestOrder;
        this.tracked = data.tracked;
        this.doNotCopy = data.doNotCopy;
        this.copy = data.copy;
    }

    setCopyDefaults (
        rawCopyDefaultsDelegate : CopyDefaultsDelegate<DataT>
    ) : (
        SetCopyDefaultsDelegate<DataT>
    ) {
        return setCopyDefaultsDelegate<DataT>(
            this as DataT,
            rawCopyDefaultsDelegate
        );
    }
}

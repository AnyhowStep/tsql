import {ILog, LogData} from "../../log";
import {ColumnUtil} from "../../../column";
import {ColumnMapUtil} from "../../../column-map";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";
import {LogMustSetTrackedDefaults} from "./06-set-tracked-defaults";
import {LogMustSetCopyDefaultsDelegate} from "./05-set-copy-defaults-delegate";

export type LogMustSetDoNotCopyData =
    & Pick<
        LogData,
        | "logTable"
        | "ownerTable"
        | "tracked"
        | "copy"
    >
    & Pick<
        ILog,
        | "latestOrder"
    >
;

export type DoNotCopy<
    DataT extends LogMustSetDoNotCopyData
> =
    readonly ColumnUtil.FromColumnMap<
        Pick<
            DataT["logTable"]["columns"],
            DataT["copy"][number]
        >
    >[]
;
export type SetDoNotCopyDelegate<
    DataT extends LogMustSetDoNotCopyData,
    DoNotCopyT extends DoNotCopy<DataT>
> =
    (
        columns : Pick<
            DataT["logTable"]["columns"],
            DataT["copy"][number]
        >
    ) => DoNotCopyT
;

export type CopyDefaultsDelegateAfterSetDoNotCopy<
    DataT extends LogMustSetDoNotCopyData,
    DoNotCopyT extends DoNotCopy<DataT>
> =
    Exclude<
        DataT["copy"][number],
        DoNotCopyT[number]["columnAlias"]
    > extends never ?
    ILog["copyDefaultsDelegate"] :
    undefined
;

export type SetDoNotCopy<
    DataT extends LogMustSetDoNotCopyData,
    DoNotCopyT extends DoNotCopy<DataT>
> = (
    CopyDefaultsDelegateAfterSetDoNotCopy<DataT, DoNotCopyT> extends ILog["copyDefaultsDelegate"] ?
    LogMustSetTrackedDefaults<{
        logTable : DataT["logTable"];
        ownerTable : DataT["ownerTable"];
        latestOrder : DataT["latestOrder"];
        tracked : DataT["tracked"];
        doNotCopy : readonly (DoNotCopyT[number]["columnAlias"])[];
        copy : readonly Exclude<
            DataT["copy"][number],
            DoNotCopyT[number]["columnAlias"]
        >[];
        copyDefaultsDelegate : ILog["copyDefaultsDelegate"];
    }> :
    LogMustSetCopyDefaultsDelegate<{
        logTable : DataT["logTable"];
        ownerTable : DataT["ownerTable"];
        latestOrder : DataT["latestOrder"];
        tracked : DataT["tracked"];
        doNotCopy : readonly (DoNotCopyT[number]["columnAlias"])[];
        copy : readonly Exclude<
            DataT["copy"][number],
            DoNotCopyT[number]["columnAlias"]
        >[];
    }>
);
export function setDoNotCopy<
    DataT extends LogMustSetDoNotCopyData,
    DoNotCopyT extends DoNotCopy<DataT>
> (
    log : DataT,
    delegate : SetDoNotCopyDelegate<DataT, DoNotCopyT>
) : (
    SetDoNotCopy<
        DataT,
        DoNotCopyT
    >
) {
    const columns = ColumnMapUtil.pick(
        log.logTable.columns,
        log.copy
    );
    const doNotCopy = delegate(columns);
    ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
        columns,
        doNotCopy
    );

    const {
        logTable,
        ownerTable,
        latestOrder,
        tracked,
    } = log;
    const copy = log.copy
        .filter((columnName) : columnName is (
            Exclude<
                DataT["copy"][number],
                DoNotCopyT[number]["columnAlias"]
            >
        ) => {
            return !doNotCopy.some(
                c => c.columnAlias == columnName
            );
        });

    if (copy.length == 0) {
        const result = new LogMustSetTrackedDefaults<{
            logTable : DataT["logTable"];
            ownerTable : DataT["ownerTable"];
            latestOrder : DataT["latestOrder"];
            tracked : DataT["tracked"];
            doNotCopy : readonly (DoNotCopyT[number]["columnAlias"])[];
            copy : readonly Exclude<
                DataT["copy"][number],
                DoNotCopyT[number]["columnAlias"]
            >[];
            copyDefaultsDelegate : ILog["copyDefaultsDelegate"];
        }>({
            logTable,
            ownerTable,
            latestOrder,
            tracked,
            doNotCopy : doNotCopy.map(c => c.columnAlias),
            copy,
            copyDefaultsDelegate : () => Promise.resolve({}),
        });
        return result as any;
    } else {
        const result = new LogMustSetCopyDefaultsDelegate<{
            logTable : DataT["logTable"];
            ownerTable : DataT["ownerTable"];
            latestOrder : DataT["latestOrder"];
            tracked : DataT["tracked"];
            doNotCopy : readonly (DoNotCopyT[number]["columnAlias"])[];
            copy : readonly Exclude<
                DataT["copy"][number],
                DoNotCopyT[number]["columnAlias"]
            >[];
        }>({
            logTable,
            ownerTable,
            latestOrder,
            tracked,
            doNotCopy : doNotCopy.map(c => c.columnAlias),
            copy,
        });
        return result as any;
    }
}

export class LogMustSetDoNotCopy<DataT extends LogMustSetDoNotCopyData> {
    readonly logTable : DataT["logTable"];
    readonly ownerTable : DataT["ownerTable"];
    readonly latestOrder : DataT["latestOrder"];
    readonly tracked : DataT["tracked"];
    readonly copy : DataT["copy"];

    constructor (data : DataT) {
        this.logTable = data.logTable;
        this.ownerTable = data.ownerTable;
        this.latestOrder = data.latestOrder;
        this.tracked = data.tracked;
        this.copy = data.copy;
    }

    setDoNotCopy<
        DoNotCopyT extends DoNotCopy<DataT>
    > (
        delegate : SetDoNotCopyDelegate<DataT, DoNotCopyT>
    ) : (
        SetDoNotCopy<DataT, DoNotCopyT>
    ) {
        return setDoNotCopy<DataT, DoNotCopyT>(
            this as DataT,
            delegate
        );
    }
}

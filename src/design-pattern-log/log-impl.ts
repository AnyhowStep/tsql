import {LogData, ILog} from "./log";
import {SelectConnection, IsolableSelectConnection} from "../execution";
import {PrimaryKey_Input} from "../primary-key";
import * as LogUtil from "./util";

export class Log<DataT extends LogData> implements ILog<DataT> {
    readonly tracked : DataT["tracked"];
    readonly doNotCopy : DataT["doNotCopy"];
    readonly copy : DataT["copy"];
    readonly trackedWithDefaultValue : DataT["trackedWithDefaultValue"];

    readonly logTable : DataT["logTable"];
    readonly ownerTable : DataT["ownerTable"];

    readonly newestOrder : ILog["newestOrder"];
    readonly copyDefaultsDelegate : ILog["copyDefaultsDelegate"];
    readonly trackedDefaults : ILog["trackedDefaults"];

    constructor (
        data : DataT,
        extraData : Pick<
            ILog,
            | "newestOrder"
            | "copyDefaultsDelegate"
            | "trackedDefaults"
        >
    ) {
        this.tracked = data.tracked;
        this.doNotCopy = data.doNotCopy;
        this.copy = data.copy;
        this.trackedWithDefaultValue = data.trackedWithDefaultValue;

        this.logTable = data.logTable;
        this.ownerTable = data.ownerTable;

        this.newestOrder = extraData.newestOrder;
        this.copyDefaultsDelegate = extraData.copyDefaultsDelegate;
        this.trackedDefaults = extraData.trackedDefaults;
    }

    fetchDefault (
        connection : IsolableSelectConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>
    ) : (
        Promise<LogUtil.DefaultRow<this>>
    ) {
        return LogUtil.fetchDefault<this>(
            this,
            connection,
            primaryKey
        );
    }

    fetchLatest (
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>
    ) : (
        LogUtil.FetchLatest<this>
    ) {
        return LogUtil.fetchLatest<this>(
            this,
            connection,
            primaryKey
        );
    }

    /**
     * @todo Make this part of fluent API of `fetchLatest()`?
     */
    fetchLatestOrDefault (
        connection : IsolableSelectConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>
    ) : (
        Promise<LogUtil.FetchLatestOrDefault<this>>
    ) {
        return LogUtil.fetchLatestOrDefault<this>(
            this,
            connection,
            primaryKey
        );
    }

}

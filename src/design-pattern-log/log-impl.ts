import {LogData, ILog} from "./log";
import {SelectConnection} from "../execution";
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


    fetchLatest (
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>
    ) : (
        LogUtil.FetchLatestByPrimaryKey<this>
    ) {
        return LogUtil.fetchLatestByPrimaryKey<this>(
            this,
            connection,
            primaryKey
        );
    }
}

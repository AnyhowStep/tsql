import {TableWithPrimaryKey} from "../../../table";
import {LogMustSetLatestOrder} from "./02-set-latest-order";
import {LogData} from "../../log";

export type LogMustSetOwnerData = Pick<
    LogData,
    | "logTable"
>;

export class LogMustSetOwner<DataT extends LogMustSetOwnerData> {
    readonly logTable : DataT["logTable"];

    constructor (data : DataT) {
        this.logTable = data.logTable;
    }

    setOwner<OwnerTableT extends TableWithPrimaryKey> (ownerTable : OwnerTableT) : (
        LogMustSetLatestOrder<{
            logTable : DataT["logTable"],
            ownerTable : OwnerTableT,
        }>
    ) {
        return new LogMustSetLatestOrder<{
            logTable : DataT["logTable"],
            ownerTable : OwnerTableT,
        }>({
            logTable : this.logTable,
            ownerTable,
        });
    }
}

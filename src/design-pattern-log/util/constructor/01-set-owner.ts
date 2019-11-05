import {TableWithPrimaryKey} from "../../../table";
import {LogMustSetNewestOrder} from "./02-set-newest-order";
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
        LogMustSetNewestOrder<{
            logTable : DataT["logTable"],
            ownerTable : OwnerTableT,
        }>
    ) {
        return new LogMustSetNewestOrder<{
            logTable : DataT["logTable"],
            ownerTable : OwnerTableT,
        }>({
            logTable : this.logTable,
            ownerTable,
        });
    }
}

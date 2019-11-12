import {ILog} from "../../log";
import {PrimaryKey_Input} from "../../../primary-key";
import {latestByPrimaryKey} from "./latest-by-primary-key";
import {ExecutionUtil, SelectConnection} from "../../../execution";
import {Row} from "../../../row";

export type FetchLatest<LogT extends ILog> =
    ExecutionUtil.FetchOnePromise<
        Row<LogT["logTable"]>
    >
;
export function fetchLatest<LogT extends ILog> (
    log : LogT,
    connection : SelectConnection,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>
) : (
    FetchLatest<LogT>
) {
    const result : (
        ExecutionUtil.FetchOnePromise<any>
    ) = latestByPrimaryKey(log, primaryKey)
        .select(((columns : any) => [columns]) as any)
        .fetchOne(connection);
    return result;
}

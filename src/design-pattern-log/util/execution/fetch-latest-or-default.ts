import {ILog} from "../../log";
import {DefaultRow, fetchDefault} from "./fetch-default";
import {Row} from "../../../row";
import {IsolableSelectConnection} from "../../../execution";
import {PrimaryKey_Input} from "../../../primary-key";
import {fetchLatest} from "./fetch-latest";

export type LatestOrDefault<LatestRowT, DefaultRowT> =
    | {
        isDefault : false,
        row : LatestRowT,
    }
    | {
        isDefault : true,
        row : DefaultRowT,
    }
;
export type FetchLatestOrDefault<LogT extends ILog> =
    LatestOrDefault<
        Row<LogT["logTable"]>,
        DefaultRow<LogT>
    >
;

export async function fetchLatestOrDefault<
    LogT extends ILog
> (
    log : LogT,
    connection : IsolableSelectConnection,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>
) : Promise<FetchLatestOrDefault<LogT>> {
    return connection.transactionIfNotInOne(async (connection) : Promise<FetchLatestOrDefault<LogT>> => {
        const latestOrUndefined = await fetchLatest(log, connection, primaryKey).orUndefined();
        if (latestOrUndefined != undefined) {
            return {
                isDefault : false,
                row : latestOrUndefined,
            } as const;
        }
        return fetchDefault(log, connection, primaryKey)
            .then((def) => {
                return {
                    isDefault : true,
                    row : def,
                } as const;
            });
    });
}

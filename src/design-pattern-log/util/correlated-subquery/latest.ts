import {ILog} from "../../log";
import {QueryUtil} from "../../../unified-query";
import * as ExprLib from "../../../expr-library";

export type Latest<LogT extends ILog> = (
    QueryUtil.LimitBigInt<
        QueryUtil.OrderBy<
            QueryUtil.Where<
                QueryUtil.From<
                    QueryUtil.NewInstanceWithOuterQueryJoins<
                        [LogT["ownerTable"]]
                    >,
                    LogT["logTable"]
                >
            >
        >,
        1n
    >
);
export function latest<LogT extends ILog> (
    log : LogT
) : (
    Latest<LogT>
) {
    return QueryUtil.newInstance()
        .requireOuterQueryJoins(...([log.ownerTable] as any))
        .from(log.logTable as any)
        .where(() => ExprLib.eqPrimaryKeyOfTable(
            log.logTable,
            log.ownerTable
        ))
        .orderBy(() => [log.latestOrder as any])
        .limit(1) as unknown as Latest<LogT>;
}

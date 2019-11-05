import {ILog} from "../../../log";
import {QueryUtil} from "../../../../unified-query";
import {PrimaryKey_Input, PrimaryKeyUtil} from "../../../../primary-key";
import * as ExprLib from "../../../../expr-library";

export type LatestByPrimaryKey<LogT extends ILog> = (
    QueryUtil.LimitBigInt<
        QueryUtil.OrderBy<
            QueryUtil.WhereEqColumns<
                QueryUtil.From<
                    QueryUtil.NewInstance,
                    LogT["logTable"]
                >
            >
        >,
        1n
    >
);
export function latestByPrimaryKey<LogT extends ILog> (
    log : LogT,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>
) : (
    LatestByPrimaryKey<LogT>
) {
    primaryKey = PrimaryKeyUtil.mapper(log.ownerTable)(
        `${log.ownerTable.alias} PRIMARY KEY`,
        primaryKey
    ) as any;

    return QueryUtil.newInstance()
        .from<LogT["logTable"]>(log.logTable as any)
        .where(() => ExprLib.eqColumns(
            log.logTable,
            primaryKey as any
        ))
        .orderBy(() => [log.newestOrder as any])
        .limit(1);
}

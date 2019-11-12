import {ILog} from "../../log";
import {QueryUtil} from "../../../unified-query";
import {PrimaryKey_Input, PrimaryKeyUtil} from "../../../primary-key";
import * as ExprLib from "../../../expr-library";
import {SelectConnection} from "../../../execution";

export async function exists<LogT extends ILog> (
    log : LogT,
    connection : SelectConnection,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>
) : (
    Promise<boolean>
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
        .exists(connection);
}

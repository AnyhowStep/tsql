import * as tm from "type-mapping";
import {ILog} from "../../log";
import {QueryUtil} from "../../../unified-query";
import * as ExprLib from "../../../expr-library";
import {Expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";

export type Exists<LogT extends ILog> =
    Expr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : UsedRefUtil.FromColumnMap<LogT["ownerTable"]["columns"]>,
        isAggregate : false,
    }>
;
export function exists<LogT extends ILog> (
    log : LogT
) : (
    Exists<LogT>
) {
    return ExprLib.exists(
        QueryUtil.newInstance()
            .requireOuterQueryJoins<LogT["ownerTable"][]>(...[log.ownerTable] as any)
            .from<LogT["logTable"]>(log.logTable as any)
            .where(() => ExprLib.eqPrimaryKeyOfTable(
                log.logTable,
                log.ownerTable
            ))
    );
}

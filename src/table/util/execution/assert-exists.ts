import {SelectConnection} from "../../../execution";
import {WhereDelegate} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {ITable} from "../../table";
import {QueryUtil} from "../../../unified-query";

export async function assertExists<TableT extends ITable> (
    table : TableT,
    connection : SelectConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >
) : (
    Promise<void>
) {
    return QueryUtil.newInstance()
        .from<TableT>(
            table as (
                TableT &
                QueryUtil.AssertValidCurrentJoin<QueryUtil.NewInstance, TableT>
            )
        )
        .where(whereDelegate)
        .assertExists(connection);
}

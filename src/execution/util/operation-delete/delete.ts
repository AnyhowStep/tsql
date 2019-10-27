import {DeletableTable} from "../../../table";
import {WhereDelegate, WhereClauseUtil} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {DeleteResult, DeleteConnection} from "../../connection";

async function del<
    TableT extends DeletableTable
> (
    connection : DeleteConnection,
    table : TableT,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >
) : Promise<DeleteResult> {
    const where = WhereClauseUtil.where(
        FromClauseUtil.from<
            FromClauseUtil.NewInstance,
            TableT
        >(
            FromClauseUtil.newInstance(),
            table as (
                & TableT
                & FromClauseUtil.AssertValidCurrentJoinBase<
                    FromClauseUtil.NewInstance,
                    TableT
                >
            )
        ),
        undefined,
        whereDelegate
    );
    return connection.delete(table, where);
}
export {
    del as delete,
};

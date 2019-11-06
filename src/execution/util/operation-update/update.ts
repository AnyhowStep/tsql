import {ITable} from "../../../table";
import {WhereDelegate, WhereClauseUtil} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {UpdateConnection, UpdateResult} from "../../connection";
import {AssignmentMapDelegate, UpdateUtil} from "../../../update";

export async function update<
    TableT extends ITable
> (
    table : TableT,
    connection : UpdateConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    assignmentMapDelegate : AssignmentMapDelegate<TableT>
) : Promise<UpdateResult> {
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
    const assignmentMap = UpdateUtil.set(table, assignmentMapDelegate);
    return connection.update(table, where, assignmentMap);
}

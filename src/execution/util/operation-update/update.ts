import {ITable} from "../../../table";
import {WhereDelegate, WhereClauseUtil} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {UpdateConnection, UpdateResult} from "../../connection";
import {AssignmentMapDelegate, UpdateUtil} from "../../../update";

export async function update<
    TableT extends ITable
> (
    connection : UpdateConnection,
    table : TableT,
    assignmentMapDelegate : AssignmentMapDelegate<TableT>,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >
) : Promise<UpdateResult> {
    const assignmentMap = UpdateUtil.set(table, assignmentMapDelegate);
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
    return connection.update(table, assignmentMap, where);
}

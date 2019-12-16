import {ExecutionUtil, SelectConnection} from "../../../execution";
import {ITablePerType} from "../../table-per-type";
import {From, from} from "./from";
import {WhereDelegate} from "../../../where-clause";

export async function assertExistsImpl<
    TptT extends ITablePerType
> (
    tpt : TptT,
    connection : SelectConnection,
    whereDelegate : WhereDelegate<From<TptT>["fromClause"]>
) : (
    Promise<void>
) {
    return ExecutionUtil.assertExists(
        from(tpt)
            .where(whereDelegate),
        connection
    );
}

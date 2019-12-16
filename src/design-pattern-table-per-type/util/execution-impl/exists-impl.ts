import {ExecutionUtil, SelectConnection} from "../../../execution";
import {ITablePerType} from "../../table-per-type";
import {From, from} from "./from";
import {WhereDelegate} from "../../../where-clause";

export async function existsImpl<
    TptT extends ITablePerType
> (
    tpt : TptT,
    connection : SelectConnection,
    whereDelegate : WhereDelegate<From<TptT>["fromClause"]>
) : (
    Promise<{
        sql : string,
        exists : boolean,
    }>
) {
    return ExecutionUtil.existsImpl(
        from(tpt)
            .where(whereDelegate),
        connection
    );
}

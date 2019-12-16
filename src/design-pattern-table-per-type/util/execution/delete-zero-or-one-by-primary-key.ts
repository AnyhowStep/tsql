import {DeletableTablePerType} from "../../table-per-type";
import {IsolableDeleteConnection} from "../../../execution";
import * as ExprLib from "../../../expr-library";
import {DeleteZeroOrOneResult, deleteZeroOrOneImpl} from "../execution-impl";
import {PrimaryKey_Input} from "../../../primary-key";

export async function deleteZeroOrOneByPrimaryKey<
    TptT extends DeletableTablePerType
> (
    tpt : TptT,
    connection : IsolableDeleteConnection,
    primaryKey : PrimaryKey_Input<TptT["childTable"]>
) : Promise<DeleteZeroOrOneResult> {
    return deleteZeroOrOneImpl(
        tpt,
        connection,
        () => ExprLib.eqPrimaryKey(
            tpt.childTable,
            primaryKey
        ) as any
    );
}

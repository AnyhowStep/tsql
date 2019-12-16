import {DeletableTablePerType} from "../../table-per-type";
import {IsolableDeleteConnection} from "../../../execution";
import {DeleteZeroOrOneResult, deleteZeroOrOneImpl} from "../execution-impl";
import {SuperKey} from "../query";
import {eqSuperKey} from "../operation";

export async function deleteZeroOrOneBySuperKey<
    TptT extends DeletableTablePerType
> (
    tpt : TptT,
    connection : IsolableDeleteConnection,
    superKey : SuperKey<TptT>
) : Promise<DeleteZeroOrOneResult> {
    return deleteZeroOrOneImpl(
        tpt,
        connection,
        () => eqSuperKey(
            tpt,
            superKey
        ) as any
    );
}

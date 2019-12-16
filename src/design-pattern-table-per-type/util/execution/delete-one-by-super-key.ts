import {DeletableTablePerType} from "../../table-per-type";
import {IsolableDeleteConnection} from "../../../execution";
import {DeleteOneResult, deleteOneImpl} from "../execution-impl";
import {SuperKey} from "../query";
import {eqSuperKey} from "../operation";

export async function deleteOneBySuperKey<
    TptT extends DeletableTablePerType
> (
    tpt : TptT,
    connection : IsolableDeleteConnection,
    superKey : SuperKey<TptT>
) : Promise<DeleteOneResult> {
    return deleteOneImpl(
        tpt,
        connection,
        () => eqSuperKey(
            tpt,
            superKey
        ) as any
    );
}

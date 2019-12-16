import * as tm from "type-mapping";
import {DeletableTablePerType} from "../../table-per-type";
import {IsolableDeleteConnection} from "../../../execution";
import {From} from "./from";
import {WhereDelegate} from "../../../where-clause";
import {DeleteOneResult, deleteOneImpl} from "./delete-one-impl";
import {existsImpl} from "./exists-impl";

export interface DeleteZeroResult {
    /**
     * Used as a discriminant.
     */
    deleteOneResults : undefined,

    query : { sql : string },

    //Alias for affectedRows
    deletedRowCount : 0n;

    /**
     * @todo MySQL sometimes gives a `warningCount` value `> 0` for
     * `DELETE` statements. Recall why.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}

export type DeleteZeroOrOneResult =
    | DeleteZeroResult
    | DeleteOneResult
;

export async function deleteZeroOrOneImpl<
    TptT extends DeletableTablePerType
> (
    tpt : TptT,
    connection : IsolableDeleteConnection,
    whereDelegate : WhereDelegate<From<TptT>["fromClause"]>
) : Promise<DeleteZeroOrOneResult> {
    /**
     * @todo Add `assertDeletable()` or something
     */
    return connection.transactionIfNotInOne(async (connection) : Promise<DeleteZeroOrOneResult> => {
        const existsResult = await existsImpl(
            tpt,
            connection,
            whereDelegate
        );

        if (!existsResult.exists) {
            return {
                /**
                 * Used as a discriminant.
                 */
                deleteOneResults : undefined,

                query : { sql : existsResult.sql },

                //Alias for affectedRows
                deletedRowCount : tm.BigInt(0) as 0n,

                /**
                 * @todo MySQL sometimes gives a `warningCount` value `> 0` for
                 * `DELETE` statements. Recall why.
                 */
                warningCount : tm.BigInt(0),
                /**
                 * An arbitrary message.
                 * May be an empty string.
                 */
                message : "",
            };
        }

        return deleteOneImpl(
            tpt,
            connection,
            whereDelegate
        );
    });
}

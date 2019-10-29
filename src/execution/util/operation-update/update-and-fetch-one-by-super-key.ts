import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {AssignmentMapDelegate, AssignmentMap, UpdateUtil} from "../../../update";
import {AssertNonUnion, Identity} from "../../../type-util";
import {updateOne} from "./update-one";
import {RawExprUsingColumnMap} from "../../../raw-expr";
import * as ExprLib from "../../../expr-library";
import {SuperKey_Input, SuperKeyUtil} from "../../../super-key";
import {UpdateAndFetchOneResult} from "./update-and-fetch-one-by-candidate-key";

export type UpdateAndFetchOneBySuperKeyAssignmentMapImpl<
    TableT extends ITable,
    /**
     * Assumes this is not a union
     */
    SuperKeyT extends SuperKey_Input<TableT>
> =
    Identity<
        & {
            readonly [columnAlias in Exclude<TableT["mutableColumns"][number], Extract<keyof SuperKeyT, string>>]? : (
                RawExprUsingColumnMap<
                    TableT["columns"],
                    ReturnType<
                        TableT["columns"][columnAlias]["mapper"]
                    >
                >
            )
        }
        & {
            readonly [columnAlias in Extract<TableT["mutableColumns"][number], Extract<keyof SuperKeyT, string>>]? : (
                ReturnType<
                    TableT["columns"][columnAlias]["mapper"]
                >
            )
        }
        & {
            readonly [
                columnAlias in Exclude<
                    TableUtil.ColumnAlias<TableT>,
                    TableT["mutableColumns"][number]
                >
            ]? : undefined
        }
    >
;

export type UpdateAndFetchOneBySuperKeyAssignmentMap<
    TableT extends ITable,
    /**
     * Assumes this is not a union
     */
    SuperKeyT extends SuperKey_Input<TableT>
> =
    Extract<
        /**
         * @todo Investigate assignability
         */
        UpdateAndFetchOneBySuperKeyAssignmentMapImpl<TableT, SuperKeyT>,
        AssignmentMap<TableT>
    >
;
export async function updateAndFetchOneBySuperKey<
    TableT extends ITable,
    SuperKeyT extends SuperKey_Input<TableT>,
    AssignmentMapT extends UpdateAndFetchOneBySuperKeyAssignmentMap<TableT, SuperKeyT>
> (
    connection : IsolableUpdateConnection,
    table : TableT,
    superKey : SuperKeyT & AssertNonUnion<SuperKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> {
    superKey = SuperKeyUtil.mapper(table)(
        `${table.alias}[superKey]`,
        superKey
    ) as any;
    const assignmentMap = UpdateUtil.set(table, assignmentMapDelegate);

    const newSuperKey = {} as any;
    for(const superColumnAlias of Object.keys(superKey)) {
        if (superKey[superColumnAlias] === undefined) {
            continue;
        }
        const newValue = assignmentMap[superColumnAlias as keyof typeof assignmentMap];
        if (newValue === undefined) {
            /**
             * This `superKey` column's value will not be updated.
             */
            newSuperKey[superColumnAlias] = superKey[superColumnAlias];
        } else {
            /**
             * This `superKey` column's value will be updated.
             * We need to know what its updated value will be.
             */
            newSuperKey[superColumnAlias] = table.columns[superColumnAlias].mapper(
                `${table.alias}.${superColumnAlias}[newValue]`,
                newValue
            );
        }
    }

    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> => {
        const updateOneResult = await updateOne(
            connection,
            table,
            () => ExprLib.eqSuperKey(
                table,
                superKey
            ) as any,
            () => assignmentMap
        );
        const row = await TableUtil.__fetchOneHelper(
            connection,
            table,
            () => ExprLib.eqSuperKey(
                table,
                newSuperKey
            ) as any
        );
        return {
            ...updateOneResult,
            row,
        };
    });
}

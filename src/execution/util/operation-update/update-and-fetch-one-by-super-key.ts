import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection, SelectConnection} from "../../connection";
import {AssignmentMapDelegate, AssignmentMap_Input} from "../../../update";
import {AssertNonUnion, Identity} from "../../../type-util";
import {updateOne} from "./update-one";
import {CustomExpr_MapCorrelated} from "../../../custom-expr";
import * as ExprLib from "../../../expr-library";
import {SuperKey_Input, SuperKeyUtil} from "../../../super-key";
import {UpdateAndFetchOneResult} from "./update-and-fetch-one-by-candidate-key";
import {RowNotFoundError} from "../../../error";
import {BuiltInExprUtil} from "../../../built-in-expr";

export type UpdateAndFetchOneBySuperKeyAssignmentMapImpl<
    TableT extends ITable
> =
    Identity<
        & {
            readonly [columnAlias in TableT["mutableColumns"][number]]? : (
                CustomExpr_MapCorrelated<
                    TableT["columns"],
                    ReturnType<
                        TableT["columns"][columnAlias]["mapper"]
                    >
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
    TableT extends ITable
> =
    Extract<
        /**
         * @todo Investigate assignability
         */
        UpdateAndFetchOneBySuperKeyAssignmentMapImpl<TableT>,
        AssignmentMap_Input<TableT>
    >
;

/**
 * Not meant to be called externally
 *
 * @todo Better name
 */
export async function __updateAndFetchOneBySuperKeyHelper<
    TableT extends ITable,
    SuperKeyT extends SuperKey_Input<TableT>,
    AssignmentMapT extends UpdateAndFetchOneBySuperKeyAssignmentMap<TableT>
> (
    table : TableT,
    connection : SelectConnection,
    superKey : SuperKeyT & AssertNonUnion<SuperKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<
    | {
        success : false,
        rowNotFoundError : RowNotFoundError,
    }
    | {
        success : true,
        curSuperKey : SuperKey_Input<TableT>,
        assignmentMap : UpdateAndFetchOneBySuperKeyAssignmentMap<TableT>,
        newSuperKey : SuperKey_Input<TableT>,
    }
> {
    superKey = SuperKeyUtil.mapper(table)(
        `${table.alias}[superKey]`,
        superKey
    ) as any;
    const assignmentMap = assignmentMapDelegate(table.columns);

    const newSuperKey = {} as any;
    for(const superColumnAlias of Object.keys(superKey)) {
        if (superKey[superColumnAlias] === undefined) {
            continue;
        }
        const newCustomExpr = assignmentMap[superColumnAlias as keyof typeof assignmentMap];
        if (newCustomExpr === undefined) {
            /**
             * This `superKey` column's value will not be updated.
             */
            newSuperKey[superColumnAlias] = superKey[superColumnAlias];
        } else {
            /**
             * This `superKey` column's value will be updated.
             * We need to know what its updated value will be.
             */
            if (BuiltInExprUtil.isAnyNonValueExpr(newCustomExpr)) {
                const evaluatedNewValue = await TableUtil.fetchValue(
                    table,
                    connection,
                    () => ExprLib.eqSuperKey(
                        table,
                        superKey as any
                    ) as any,
                    () => newCustomExpr as any
                ).catch((err) => {
                    if (err instanceof RowNotFoundError) {
                        return err;
                    } else {
                        throw err;
                    }
                }) as any;
                if (evaluatedNewValue instanceof RowNotFoundError) {
                    return {
                        success : false,
                        rowNotFoundError : evaluatedNewValue,
                    };
                }
                newSuperKey[superColumnAlias] = table.columns[superColumnAlias].mapper(
                    `${table.alias}.${superColumnAlias}[newValue]`,
                    evaluatedNewValue
                );
            } else {
                newSuperKey[superColumnAlias] = table.columns[superColumnAlias].mapper(
                    `${table.alias}.${superColumnAlias}[newValue]`,
                    newCustomExpr
                );
            }
            /**
             * If it was an expression, it is now a value.
             */
            assignmentMap[superColumnAlias as keyof typeof assignmentMap] = (
                newSuperKey[superColumnAlias] as any
            );
        }
    }

    return {
        success : true,
        curSuperKey : superKey,
        assignmentMap,
        newSuperKey,
    };
}

export async function updateAndFetchOneBySuperKey<
    TableT extends ITable,
    SuperKeyT extends SuperKey_Input<TableT>,
    AssignmentMapT extends UpdateAndFetchOneBySuperKeyAssignmentMap<TableT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    superKey : SuperKeyT & AssertNonUnion<SuperKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> => {
        const helperResult = await __updateAndFetchOneBySuperKeyHelper<
            TableT,
            SuperKeyT,
            AssignmentMapT
        >(
            table,
            connection,
            superKey,
            assignmentMapDelegate
        );
        if (!helperResult.success) {
            throw helperResult.rowNotFoundError;
        }
        const {
            curSuperKey,
            assignmentMap,
            newSuperKey,
        } = helperResult;

        const updateOneResult = await updateOne(
            table,
            connection,
            () => ExprLib.eqSuperKey(
                table,
                curSuperKey
            ) as any,
            () => assignmentMap
        );
        const row = await TableUtil.__fetchOneHelper(
            table,
            connection,
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

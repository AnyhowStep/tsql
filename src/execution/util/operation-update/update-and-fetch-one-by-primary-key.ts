import {TableUtil, TableWithPrimaryKey} from "../../../table";
import {IsolableUpdateConnection, SelectConnection} from "../../connection";
import {AssignmentMapDelegate, CustomAssignmentMap} from "../../../update";
import {Identity} from "../../../type-util";
import {updateOne} from "./update-one";
import {CustomExpr_MapCorrelated} from "../../../custom-expr";
import * as ExprLib from "../../../expr-library";
import {PrimaryKey_Input, PrimaryKeyUtil} from "../../../primary-key";
import {UpdateAndFetchOneResult} from "./update-and-fetch-one-by-candidate-key";
import {RowNotFoundError} from "../../../error";
import {BuiltInExprUtil} from "../../../built-in-expr";

export type UpdateAndFetchOneByPrimaryKeyAssignmentMapImpl<
    TableT extends TableWithPrimaryKey
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
export type UpdateAndFetchOneByPrimaryKeyAssignmentMap<
    TableT extends TableWithPrimaryKey
> =
    Extract<
        /**
         * @todo Investigate assignability
         */
        UpdateAndFetchOneByPrimaryKeyAssignmentMapImpl<TableT>,
        CustomAssignmentMap<TableT>
    >
;

/**
 * Not meant to be called externally
 *
 * @todo Better name
 */
export async function __updateAndFetchOneByPrimaryKeyHelper<
    TableT extends TableWithPrimaryKey,
    AssignmentMapT extends UpdateAndFetchOneByPrimaryKeyAssignmentMap<TableT>
> (
    table : TableT,
    connection : SelectConnection,
    primaryKey : PrimaryKey_Input<TableT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<
    | {
        success : false,
        rowNotFoundError : RowNotFoundError,
    }
    | {
        success : true,
        curPrimaryKey : PrimaryKey_Input<TableT>,
        assignmentMap : UpdateAndFetchOneByPrimaryKeyAssignmentMap<TableT>,
        newPrimaryKey : PrimaryKey_Input<TableT>,
    }
> {
    primaryKey = PrimaryKeyUtil.mapper(table)(
        `${table.alias}[primaryKey]`,
        primaryKey
    ) as any;
    const assignmentMap = assignmentMapDelegate(table.columns);

    const newPrimaryKey = {} as any;
    for(const primaryColumnAlias of Object.keys(primaryKey as any)) {
        const newCustomExpr = (
            (
                Object.prototype.hasOwnProperty.call(assignmentMap, primaryColumnAlias) &&
                Object.prototype.propertyIsEnumerable.call(assignmentMap, primaryColumnAlias)
            ) ?
            assignmentMap[primaryColumnAlias as keyof typeof assignmentMap] :
            undefined
        );
        if (newCustomExpr === undefined) {
            /**
             * This `primaryKey` column's value will not be updated.
             */
            newPrimaryKey[primaryColumnAlias] = primaryKey[primaryColumnAlias as keyof typeof primaryKey];
        } else {
            if (table.mutableColumns.indexOf(primaryColumnAlias) < 0) {
                throw new Error(`${table.alias}.${primaryColumnAlias} is not a mutable primary key column`);
            }
            /**
             * This `primaryKey` column's value will be updated.
             * We need to know what its updated value will be.
             */
            if (BuiltInExprUtil.isAnyNonValueExpr(newCustomExpr)) {
                const evaluatedNewValue = await TableUtil.fetchValue(
                    table,
                    connection,
                    () => ExprLib.eqPrimaryKey(
                        table,
                        primaryKey as any
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
                newPrimaryKey[primaryColumnAlias] = table.columns[primaryColumnAlias].mapper(
                    `${table.alias}.${primaryColumnAlias}[newValue]`,
                    evaluatedNewValue
                );
            } else {
                newPrimaryKey[primaryColumnAlias] = table.columns[primaryColumnAlias].mapper(
                    `${table.alias}.${primaryColumnAlias}[newValue]`,
                    newCustomExpr
                );
            }
            /**
             * If it was an expression, it is now a value.
             */
            assignmentMap[primaryColumnAlias as keyof typeof assignmentMap] = (
                newPrimaryKey[primaryColumnAlias] as any
            );
        }
    }

    return {
        success : true,
        curPrimaryKey : primaryKey,
        assignmentMap,
        newPrimaryKey,
    };
}

export async function updateAndFetchOneByPrimaryKey<
    TableT extends TableWithPrimaryKey,
    AssignmentMapT extends UpdateAndFetchOneByPrimaryKeyAssignmentMap<TableT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    primaryKey : PrimaryKey_Input<TableT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> {
    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> => {
        const helperResult = await __updateAndFetchOneByPrimaryKeyHelper<
            TableT,
            AssignmentMapT
        >(
            table,
            connection,
            primaryKey,
            assignmentMapDelegate
        );
        if (!helperResult.success) {
            throw helperResult.rowNotFoundError;
        }
        const {
            curPrimaryKey,
            assignmentMap,
            newPrimaryKey,
        } = helperResult;

        const updateOneResult = await updateOne(
            table,
            connection,
            () => ExprLib.eqPrimaryKey(
                table,
                curPrimaryKey
            ) as any,
            () => assignmentMap
        );
        const row = await TableUtil.__fetchOneHelper(
            table,
            connection,
            () => ExprLib.eqPrimaryKey(
                table,
                newPrimaryKey
            ) as any
        );
        return {
            ...updateOneResult,
            row,
        };
    });
}

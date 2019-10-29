import {TableUtil, TableWithPrimaryKey} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {AssignmentMapDelegate, AssignmentMap, UpdateUtil} from "../../../update";
import {Identity} from "../../../type-util";
import {updateOne} from "./update-one";
import {RawExprUsingColumnMap} from "../../../raw-expr";
import * as ExprLib from "../../../expr-library";
import {PrimaryKey_Input, PrimaryKeyUtil} from "../../../primary-key";
import {UpdateAndFetchOneResult} from "./update-and-fetch-one-by-candidate-key";

export type UpdateAndFetchOneByPrimaryKeyAssignmentMapImpl<
    TableT extends TableWithPrimaryKey
> =
    Identity<
        & {
            readonly [columnAlias in Exclude<TableT["mutableColumns"][number], TableT["primaryKey"][number]>]? : (
                RawExprUsingColumnMap<
                    TableT["columns"],
                    ReturnType<
                        TableT["columns"][columnAlias]["mapper"]
                    >
                >
            )
        }
        & {
            readonly [columnAlias in Extract<TableT["mutableColumns"][number], TableT["primaryKey"][number]>]? : (
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
export type UpdateAndFetchOneByPrimaryKeyAssignmentMap<
    TableT extends TableWithPrimaryKey
> =
    Extract<
        /**
         * @todo Investigate assignability
         */
        UpdateAndFetchOneByPrimaryKeyAssignmentMapImpl<TableT>,
        AssignmentMap<TableT>
    >
;

/**
 * Not meant to be called externally
 *
 * @todo Better name
 */
export function __updateAndFetchOneByPrimaryKeyHelper<
    TableT extends TableWithPrimaryKey,
    AssignmentMapT extends UpdateAndFetchOneByPrimaryKeyAssignmentMap<TableT>
> (
    table : TableT,
    primaryKey : PrimaryKey_Input<TableT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) {
    primaryKey = PrimaryKeyUtil.mapper(table)(
        `${table.alias}[primaryKey]`,
        primaryKey
    ) as any;
    const assignmentMap = UpdateUtil.set(table, assignmentMapDelegate);

    const newPrimaryKey = {} as any;
    for(const primaryColumnAlias of Object.keys(primaryKey as any)) {
        const newValue = assignmentMap[primaryColumnAlias as keyof typeof assignmentMap];
        if (newValue === undefined) {
            /**
             * This `primaryKey` column's value will not be updated.
             */
            newPrimaryKey[primaryColumnAlias] = primaryKey[primaryColumnAlias as keyof typeof primaryKey];
        } else {
            /**
             * This `primaryKey` column's value will be updated.
             * We need to know what its updated value will be.
             */
            newPrimaryKey[primaryColumnAlias] = table.columns[primaryColumnAlias].mapper(
                `${table.alias}.${primaryColumnAlias}[newValue]`,
                newValue
            );
        }
    }

    return {
        curPrimaryKey : primaryKey,
        assignmentMap,
        newPrimaryKey,
    };
}

export async function updateAndFetchOneByPrimaryKey<
    TableT extends TableWithPrimaryKey,
    AssignmentMapT extends UpdateAndFetchOneByPrimaryKeyAssignmentMap<TableT>
> (
    connection : IsolableUpdateConnection,
    table : TableT,
    primaryKey : PrimaryKey_Input<TableT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> {
    const {
        curPrimaryKey,
        assignmentMap,
        newPrimaryKey,
    } = __updateAndFetchOneByPrimaryKeyHelper<
        TableT,
        AssignmentMapT
    >(
        table,
        primaryKey,
        assignmentMapDelegate
    );

    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> => {
        const updateOneResult = await updateOne(
            connection,
            table,
            () => ExprLib.eqPrimaryKey(
                table,
                curPrimaryKey
            ) as any,
            () => assignmentMap
        );
        const row = await TableUtil.__fetchOneHelper(
            connection,
            table,
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

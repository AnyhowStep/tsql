import {ITable, TableUtil} from "../../../table";
import {IsolableUpdateConnection} from "../../connection";
import {AssignmentMapDelegate, AssignmentMap_Input} from "../../../update";
import {AssertNonUnion, Identity} from "../../../type-util";
import {updateOne} from "./update-one";
import {RawExprUsingColumnMap_Input} from "../../../raw-expr";
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
                RawExprUsingColumnMap_Input<
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
        AssignmentMap_Input<TableT>
    >
;

/**
 * Not meant to be called externally
 *
 * @todo Better name
 */
export function __updateAndFetchOneBySuperKeyHelper<
    TableT extends ITable,
    SuperKeyT extends SuperKey_Input<TableT>,
    AssignmentMapT extends UpdateAndFetchOneBySuperKeyAssignmentMap<TableT, SuperKeyT>
> (
    table : TableT,
    superKey : SuperKeyT & AssertNonUnion<SuperKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) {
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

    return {
        curSuperKey : superKey,
        assignmentMap,
        newSuperKey,
    };
}

export async function updateAndFetchOneBySuperKey<
    TableT extends ITable,
    SuperKeyT extends SuperKey_Input<TableT>,
    AssignmentMapT extends UpdateAndFetchOneBySuperKeyAssignmentMap<TableT, SuperKeyT>
> (
    table : TableT,
    connection : IsolableUpdateConnection,
    superKey : SuperKeyT & AssertNonUnion<SuperKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> {
    const {
        curSuperKey,
        assignmentMap,
        newSuperKey,
    } = __updateAndFetchOneBySuperKeyHelper<
        TableT,
        SuperKeyT,
        AssignmentMapT
    >(
        table,
        superKey,
        assignmentMapDelegate
    );

    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchOneResult<TableT, AssignmentMapT>> => {
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

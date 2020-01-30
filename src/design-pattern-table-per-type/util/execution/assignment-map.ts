import {ITablePerType} from "../../table-per-type";
import {Identity} from "../../../type-util";
import {MutableColumnAlias, ColumnType, ColumnAlias} from "../query";
import {CustomExpr_MapCorrelated_NonAggregateOrUndefined} from "../../../custom-expr";
import {ColumnRefUtil} from "../../../column-ref";
import {ColumnUtil} from "../../../column";

export type CustomAssignmentMap<
    TptT extends ITablePerType
> =
    Identity<
        & {
            readonly [columnAlias in MutableColumnAlias<TptT>]? : (
                /**
                 * The following `UPDATE` statement is invalid,
                 * aggregate expressions are not allowed.
                 * ```sql
                 *  UPDATE myTable SET myColumn = SUM(myColumn);
                 * ```
                 */
                CustomExpr_MapCorrelated_NonAggregateOrUndefined<
                    (
                        | TptT["childTable"]["columns"]
                        | TptT["parentTables"][number]["columns"]
                    ),
                    ColumnType<TptT, columnAlias>
                >
            )
        }
        & {
            readonly [
                columnAlias in Exclude<
                    ColumnAlias<TptT>,
                    MutableColumnAlias<TptT>
                >
            ]? : undefined
        }
    >
;

export type AssignmentMapDelegate<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> =
    (
        columns : ColumnRefUtil.FromColumnArray<
            ColumnUtil.FromColumnMap<
                | TptT["childTable"]["columns"]
                | TptT["parentTables"][number]["columns"]
            >[]
        >
    ) => AssignmentMapT
;

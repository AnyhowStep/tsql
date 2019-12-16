import {ITablePerType} from "../../table-per-type";
import {CustomAssignmentMap, AssignmentMapDelegate} from "./update-and-fetch-one-by-candidate-key";
import {IsolableSelectConnection, ExecutionUtil} from "../../../execution";
import {ColumnRefUtil} from "../../../column-ref";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {from, From} from "../execution-impl";
import {WhereDelegate} from "../../../where-clause";
import {isMutableColumnAlias, columnMapper} from "../query";
import {BuiltInExprUtil} from "../../../built-in-expr";
import {expr, ExprUtil} from "../../../expr";
import {DataTypeUtil} from "../../../data-type";

/**
 * Not meant to be called externally.
 *
 * @todo Better name
 */
export async function invokeAssignmentDelegate<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> (
    tpt : TptT,
    connection : IsolableSelectConnection,
    whereDelegate : WhereDelegate<From<TptT>["fromClause"]>,
    assignmentMapDelegate : AssignmentMapDelegate<TptT, AssignmentMapT>
) : Promise<Record<string, unknown>> {
    const columns = ColumnRefUtil.fromColumnArray<
        ColumnUtil.FromColumnMap<
            | TptT["childTable"]["columns"]
            | TptT["parentTables"][number]["columns"]
        >[]
    >(
        ColumnArrayUtil.fromColumnMapArray<
            | TptT["childTable"]["columns"]
            | TptT["parentTables"][number]["columns"]
        >(
            [
                tpt.childTable.columns,
                ...tpt.parentTables.map(parentTable => parentTable.columns)
            ]
        )
    );
    /**
     * May contain extra properties that are not mutable columns,
     * or even columns at all.
     */
    const rawAssignmentMap = assignmentMapDelegate(columns);

    const columnAliasArr = Object.keys(rawAssignmentMap);
    if (columnAliasArr.length == 0) {
        /**
         * @todo Perform an exists check, if the row does not exist,
         * throw rowNotFound, for early-exit.
         *
         * At the moment, this isn't so important because we have
         * other methods downstream that will throw it.
         */
        return {};
    }

    const query = from(tpt)
        .where(whereDelegate as any)
        .select(() => columnAliasArr
            .filter(columnAlias => isMutableColumnAlias(tpt, columnAlias))
            .map(columnAlias => {
                const customExpr = rawAssignmentMap[columnAlias as keyof typeof rawAssignmentMap] as any;
                if (BuiltInExprUtil.isAnyNonValueExpr(customExpr)) {
                    /**
                     * We have a non-value expression
                     */
                    return expr(
                        {
                            mapper : DataTypeUtil.intersect(
                                columnMapper(tpt, columnAlias),
                                BuiltInExprUtil.mapper(customExpr)
                            ),
                            usedRef : BuiltInExprUtil.usedRef(customExpr),
                        },
                        BuiltInExprUtil.buildAst(customExpr)
                    ).as(columnAlias);
                } else {
                    /**
                     * We have a value expression
                     */
                    return ExprUtil.fromRawExprNoUsedRefInput(
                        columnMapper(tpt, columnAlias),
                        customExpr
                    ).as(columnAlias);
                }
            }) as any
        );
    /**
     * Should only contain value expressions now.
     */
    return ExecutionUtil.fetchOne(
        query as any,
        connection
    ) as Promise<Record<string, unknown>>;
}

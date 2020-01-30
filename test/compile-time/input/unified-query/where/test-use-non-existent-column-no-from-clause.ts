import * as tsql from "../../../../../dist";

export const query = tsql.QueryUtil.newInstance()
    /**
     * This should not be allowed because `myOtherTable` is not in the `FROM` clause
     * ```ts
     *  .where(columns => tsql.eq(
     *      columns.myOtherTable.myOtherTableId,
     *      32n
     *  ))
     * ```
     */;

type AllowedUsedRef = tsql.FromClauseUtil.AllowedUsedRef<typeof query["fromClause"], { isLateral : true }>;
type AllowedExpr = tsql.IExpr<{
    mapper : () => boolean,
    usedRef : AllowedUsedRef,
    isAggregate : false,
}>;
type MyExpr = tsql.IExpr<{
    mapper : () => boolean,
    usedRef : tsql.IUsedRef<{
        myOtherTable: {
            myOtherTableId: bigint,
        },
    }>,
    isAggregate : false,
}>;
declare const whereClause : MyExpr;
export const notAllowed : AllowedExpr = whereClause;

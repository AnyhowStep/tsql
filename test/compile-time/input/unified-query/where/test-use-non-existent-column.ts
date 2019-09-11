import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
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
    usedRef : AllowedUsedRef
}>;
type MyExpr = tsql.IExpr<{
    mapper : () => boolean,
    usedRef : tsql.IUsedRef<{
        myOtherTable: {
            myOtherTableId: bigint,
        },
    }>
}>;
declare const whereClause : MyExpr;
export const notAllowed : AllowedExpr = whereClause;

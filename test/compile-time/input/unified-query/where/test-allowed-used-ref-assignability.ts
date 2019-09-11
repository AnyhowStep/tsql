import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        myOtherTableId : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .crossJoin(myOtherTable)
    /**
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
/**
 * + `query` allows two columns.
 * + `whereClause` uses one of the allowed columns.
 */
export const allowed : AllowedExpr = whereClause;

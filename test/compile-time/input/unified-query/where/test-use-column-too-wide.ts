import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable);

type AllowedUsedRef = tsql.FromClauseUtil.AllowedUsedRef<typeof query["fromClause"], { isLateral : true }>;
type AllowedExpr = tsql.IExpr<{
    mapper : () => boolean,
    usedRef : AllowedUsedRef
}>;
type MyExpr = tsql.IExpr<{
    mapper : () => boolean,
    usedRef : tsql.IUsedRef<{
        myTable: {
            /**
             * We make this `WHERE` clause handle `myTableId`, even if it is `null`.
             * So, `bigint|null`.
             */
            myTableId: bigint|null,
        },
    }>
}>;
declare const whereClause : MyExpr;
/**
 * This is allowed because the column will always be `bigint`.
 * And our `WHERE` clause can handle both `bigint` and `null` cases.
 */
export const notAllowed : AllowedExpr = whereClause;

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        /**
         * We make this column nullable.
         * So, `bigint|null`.
         */
        myTableId : tm.mysql.bigIntUnsigned().orNull(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable);

type AllowedUsedRef = tsql.FromClauseUtil.AllowedUsedRef<typeof query["fromClause"], { isLateral : true }>;
type AllowedExpr = tsql.IExpr<{
    mapper : () => boolean,
    usedRef : AllowedUsedRef,
    isAggregate : false,
}>;
type MyExpr = tsql.IExpr<{
    mapper : () => boolean,
    usedRef : tsql.IUsedRef<{
        myTable: {
            /**
             * We make this `WHERE` clause require that `myTableId` is **NON-NULLABLE**.
             * So, `bigint` only.
             */
            myTableId: bigint,
        },
    }>,
    isAggregate : false,
}>;
declare const whereClause : MyExpr;
export const notAllowed : AllowedExpr = whereClause;

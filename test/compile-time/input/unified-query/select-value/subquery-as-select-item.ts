import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        myColumn : tm.mysql.bigIntSigned(),
        myColumn2 : tm.mysql.bigIntSigned(),
        stringColumn : tm.mysql.varChar(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        otherColumn : tm.mysql.bigIntSigned(),
    });

export const myQuery = tsql
    .from(myTable)
    .selectValue((_columns, subquery) =>
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                /**
                 * We now have multiple tables in the `FROM` clause (and outer query `FROM` clause).
                 * So, we must now qualify columns with a table name.
                 */
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
    );
export const fetchedRow = myQuery.fetchOne(null as any);

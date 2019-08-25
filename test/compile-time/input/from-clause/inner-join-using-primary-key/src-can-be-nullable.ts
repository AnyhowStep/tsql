import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        createdAt : tm.mysql.dateTime(),
    })
    .setPrimaryKey(c => [c.userId, c.computerId]);

const childTable = tsql.table("childTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned().orNull(),
        computerId : tm.mysql.varChar().orNull(),
        accessedAt : tm.mysql.dateTime(),
    });

const eqPrimaryKeyOfTable = tsql.makeEqPrimaryKeyOfTable(
    tsql.makeNullSafeComparison("<=>")
);
export const fromClause = tsql.FromClauseUtil.innerJoinUsingPrimaryKey(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        childTable
    ),
    eqPrimaryKeyOfTable,
    tables => tables.childTable,
    myTable
);

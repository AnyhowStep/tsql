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
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        accessedAt : tm.mysql.dateTime(),
    });

const childTable2 = tsql.table("childTable2")
    .addColumns({
        userId : tm.mysql.bigIntSigned().orNull(),
        computerId : tm.literal("test-literal").orNull(),
        accessedAt2 : tm.mysql.dateTime(),
    });

const eqPrimaryKeyOfTable = tsql.makeEqPrimaryKeyOfTable(
    tsql.makeNullSafeComparison("<=>")
);
export const fromClause = tsql.FromClauseUtil.innerJoinUsingPrimaryKey(
    tsql.FromClauseUtil.crossJoin(
        tsql.FromClauseUtil.from(
            tsql.FromClauseUtil.newInstance(),
            childTable
        ),
        childTable2
    ),
    eqPrimaryKeyOfTable,
    tables => Math.random() > 0.5 ? tables.childTable : tables.childTable2,
    myTable
);

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.literal("hi"),
        createdAt : tm.mysql.dateTime(),
    })
    .setPrimaryKey(c => [c.userId, c.computerId]);

const childTable = tsql.table("childTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.literal("bye"),
        accessedAt : tm.mysql.dateTime(),
    });

const eqPrimaryKeyOfTable = tsql.eqPrimaryKeyOfTable;


/**
 * @todo Should this even be allowed?
 * `computerId` of both tables are disjoint types.
 * This should always be `FALSE`.
 */
export const fromClause = tsql.FromClauseUtil.innerJoinUsingPrimaryKey(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        childTable
    ),
    eqPrimaryKeyOfTable,
    tables => tables.childTable,
    myTable
);

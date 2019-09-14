import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const tableA = tsql.table("tableA")
    .addColumns({
        cqcTableAId : tm.mysql.bigIntUnsigned(),
    });

const tableB = tsql.table("tableB")
    .addColumns({
        cqcTableBId : tm.mysql.bigIntUnsigned(),
    });

const tableC = tsql.table("tableC")
    .addColumns({
        cqcTableCId : tm.mysql.bigIntUnsigned(),
    });

const query = tsql
    .from(tableA)
    .crossJoin(tableB)
    .select(columns => [columns]);

const otherQuery = tsql
    .from(tableA)
    .crossJoin(tableB)
    .crossJoin(tableC)
    .select(columns => [columns]);

export const compound = tsql.CompoundQueryClauseUtil
    .compoundQuery(
        query.fromClause,
        query.selectClause,
        undefined,
        tsql.CompoundQueryType.UNION,
        true,
        otherQuery
    );

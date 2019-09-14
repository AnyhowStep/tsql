import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        cqcTableId : tm.mysql.double(),
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        cqcOtherTableId : tm.mysql.double(),
    });

const query = tsql
    .from(myTable)
    .select(columns => [columns.cqcTableId]);

const otherQuery = tsql
    .from(myOtherTable)
    .select(columns => [
        tsql.add(columns.cqcOtherTableId, 32).as("x")
    ]);

export const compound = tsql.CompoundQueryClauseUtil
    .compoundQuery(
        query.fromClause,
        query.selectClause,
        undefined,
        tsql.CompoundQueryType.UNION,
        true,
        otherQuery
    );

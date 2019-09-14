import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        cqcTableId : tm.mysql.bigIntUnsigned(),
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        cqcOtherTableId : tm.mysql.bigIntUnsigned(),
    });

const query = tsql
    .from(myTable)
    .select(columns => [
        columns.cqcTableId,
        tsql.gt(columns.cqcTableId, 5n).as("gt")
    ]);

const otherQuery = tsql
    .from(myOtherTable)
    .select(columns => [
        columns.cqcOtherTableId,
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

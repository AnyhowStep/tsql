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

const myOtherOtherTable = tsql.table("myOtherOtherTable")
    .addColumns({
        cqcOtherOtherTableId : tm.mysql.bigIntUnsigned(),
    });

const query = tsql
    .from(myTable)
    .select(columns => [columns.cqcTableId]);

const otherQuery = tsql
    .from(myOtherTable)
    .crossJoin(myOtherOtherTable)
    .select(columns => [columns]);

export const compound = tsql.CompoundQueryClauseUtil
    .compoundQuery(
        query.selectClause,
        undefined,
        tsql.CompoundQueryType.UNION,
        true,
        otherQuery
    );

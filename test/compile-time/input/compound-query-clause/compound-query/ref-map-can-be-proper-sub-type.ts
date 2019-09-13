import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const tableACqc = tsql.table("tableACqc")
    .addColumns({
        cqcTableAId : tm.mysql.bigIntUnsigned(),
    });

const tableBCqc = tsql.table("tableBCqc")
    .addColumns({
        cqcTableBId : tm.mysql.bigIntUnsigned().orNull(),
    });

const tableBCqcCopy = tsql.table("tableBCqc")
    .addColumns({
        cqcTableBId : tm.mysql.bigIntUnsigned(),
    });

const query = tsql
    .from(tableACqc)
    .crossJoin(tableBCqc)
    .select(columns => [columns]);

const otherQuery = tsql
    .from(tableACqc)
    .crossJoin(tableBCqcCopy)
    .select(columns => [columns]);

export const compound = tsql.CompoundQueryClauseUtil
    .compoundQuery(
        query.selectClause,
        undefined,
        tsql.CompoundQueryType.UNION,
        true,
        otherQuery
    );

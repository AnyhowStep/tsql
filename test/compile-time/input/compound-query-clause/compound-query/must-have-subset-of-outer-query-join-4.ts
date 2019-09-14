import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        cqcTableId : tm.mysql.bigIntUnsigned().orNull(),
        cqcOtherTableId : tm.mysql.bigIntUnsigned(),
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        cqcTableId : tm.mysql.bigIntUnsigned().orNull(),
        cqcOtherTableId : tm.mysql.bigIntUnsigned(),
    });

const cqcOuterTable = tsql.table("cqcOuterTable")
    .addColumns({
        cqcTableId : tm.mysql.bigIntUnsigned().orNull(),
        cqcOtherTableId : tm.mysql.bigIntUnsigned(),
    });

const cqcOuterTable2 = tsql.table("cqcOuterTable2")
    .addColumns({
        cqcTableId : tm.mysql.bigIntUnsigned().orNull(),
        cqcOtherTableId : tm.mysql.bigIntUnsigned(),
    });

const query = tsql
    /**
     * This requires 2 tables
     */
    .requireOuterQueryJoins(cqcOuterTable, cqcOuterTable2)
    .from(myTable)
    .select(columns => [columns.myTable]);

const otherQuery = tsql
    /**
     * This requires 1 table
     */
    .requireNullableOuterQueryJoins(cqcOuterTable)
    .from(myOtherTable)
    .select(columns => [columns.myOtherTable]);

/**
 * This should not produce an error.
 * Every outer query table `otherQuery` requires
 * exists in the main `query`
 */
export const compound = tsql.CompoundQueryClauseUtil
    .compoundQuery(
        /**
         * This requires 2 tables
         */
        query.fromClause,
        query.selectClause,
        undefined,
        tsql.CompoundQueryType.UNION,
        true,
        /**
         * This requires 1 table
         */
        otherQuery
    );

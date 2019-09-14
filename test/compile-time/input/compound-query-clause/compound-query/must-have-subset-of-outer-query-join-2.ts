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

const query = tsql
    /**
     * This requires `cqcOuterTable` to be an outer query join
     * but all columns are nullable
     */
    .requireNullableOuterQueryJoins(cqcOuterTable)
    .from(myTable)
    .select(columns => [columns.myTable]);

const otherQuery = tsql
    /**
     * This requires `cqcOuterTable` to be an outer query join
     */
    .requireOuterQueryJoins(cqcOuterTable)
    .from(myOtherTable)
    .select(columns => [columns.myOtherTable]);

export const compound = tsql.CompoundQueryClauseUtil
    .compoundQuery(
        query.fromClause,
        /**
         * This requires `cqcOuterTable` to be an outer query join
         * but all columns are nullable
         */
        query.selectClause,
        undefined,
        tsql.CompoundQueryType.UNION,
        true,
        /**
         * This requires `cqcOuterTable` to be an outer query join
         */
        otherQuery
    );

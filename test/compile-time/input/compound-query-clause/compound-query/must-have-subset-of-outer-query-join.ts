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

/**
 * This does not require any outer query joins
 */
const query = tsql
    .from(myTable)
    .select(columns => [columns]);

const otherQuery = tsql
    /**
     * This requires `cqcOuterTable` to be an outer query join
     */
    .requireOuterQueryJoins(cqcOuterTable)
    .from(myOtherTable)
    .select(columns => [columns.myOtherTable]);

export const compound = tsql.CompoundQueryClauseUtil
    .compoundQuery(
        /**
         * This does not require any outer query joins
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

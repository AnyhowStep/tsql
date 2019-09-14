import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
/**
 * This should not produce an error.
 * Every outer query table `otherQuery` requires
 * exists in the main `query`
 */
export declare const compound: {
    selectClause: [{
        readonly cqcTableId: tsql.Column<{
            tableAlias: "myTable";
            columnAlias: "cqcTableId";
            mapper: tm.Mapper<unknown, bigint | null>;
        }>;
        readonly cqcOtherTableId: tsql.Column<{
            tableAlias: "myTable";
            columnAlias: "cqcOtherTableId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
    }];
    compoundQueryClause: readonly tsql.CompoundQuery[];
};

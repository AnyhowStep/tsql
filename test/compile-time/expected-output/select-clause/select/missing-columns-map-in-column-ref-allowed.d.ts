import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const selectClause: [{
    otherTable: {
        readonly otherTableId: tsql.Column<{
            tableAlias: "otherTable";
            columnAlias: "otherTableId";
            mapper: tm.Mapper<unknown, bigint | null>;
        }>;
    };
}];

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const selectClause: [{
    readonly myTable: {
        readonly createdAt: tsql.Column<{
            tableAlias: "myTable";
            columnAlias: "createdAt";
            mapper: tm.Mapper<unknown, Date>;
        }>;
        readonly myTableId: tsql.Column<{
            tableAlias: "myTable";
            columnAlias: "myTableId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
    };
    readonly otherTable: {
        readonly otherTableId: tsql.Column<{
            tableAlias: "otherTable";
            columnAlias: "otherTableId";
            mapper: tm.Mapper<unknown, bigint | null>;
        }>;
    };
}];

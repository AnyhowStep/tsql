import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const selectClause: [{
    readonly otherTableId: tsql.Column<{
        tableAlias: "otherTable";
        columnAlias: "otherTableId";
        mapper: tm.Mapper<unknown, bigint | null>;
    }>;
}, {
    readonly createdAt: tsql.Column<{
        tableAlias: "myTable";
        columnAlias: "createdAt";
        mapper: tm.Mapper<unknown, Date | null>;
    }>;
    readonly myTableId: tsql.Column<{
        tableAlias: "myTable";
        columnAlias: "myTableId";
        mapper: tm.Mapper<unknown, bigint>;
    }>;
}];

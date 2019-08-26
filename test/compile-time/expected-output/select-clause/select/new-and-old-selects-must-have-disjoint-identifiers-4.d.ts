import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const selectClause: [tsql.Column<{
    tableAlias: "myTable";
    columnAlias: "myTableId";
    mapper: tm.Mapper<unknown, bigint>;
}>, tsql.Column<{
    tableAlias: "otherTable";
    columnAlias: "otherTableId";
    mapper: tm.Mapper<unknown, bigint | null>;
}>];
export declare const selectClause2: any;

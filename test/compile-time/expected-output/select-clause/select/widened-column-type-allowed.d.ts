import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const selectClause: [tsql.Column<{
    tableAlias: "otherTable";
    columnAlias: "otherTableId"; /**
     * No idea why you would want to do this...
     * But it's technically sound,
     * assuming the original table is not lying about the column type.
     */
    mapper: tm.Mapper<unknown, bigint | boolean | null>;
}>];

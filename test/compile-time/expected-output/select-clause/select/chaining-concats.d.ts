import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const selectClause: [tsql.IExprSelectItem<{
    mapper: tm.Mapper<unknown, boolean>;
    tableAlias: "$aliased";
    alias: "eq";
    usedRef: tsql.IUsedRef<never>;
}>];
export declare const selectClause2: [tsql.IExprSelectItem<{
    mapper: tm.Mapper<unknown, boolean>;
    tableAlias: "$aliased";
    alias: "eq";
    usedRef: tsql.IUsedRef<never>;
}>, tsql.Column<{
    tableAlias: "myTable";
    columnAlias: "myTableId";
    mapper: tm.Mapper<unknown, bigint>;
}>, tsql.Column<{
    tableAlias: "otherTable";
    columnAlias: "otherTableId";
    mapper: tm.Mapper<unknown, bigint | null>;
}>];

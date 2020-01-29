import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const selectClause: [tsql.IExprSelectItem<{
    mapper: tm.Mapper<unknown, boolean>;
    tableAlias: "$aliased";
    alias: "eq";
    usedRef: tsql.IUsedRef<never>;
    isAggregate: false;
}>];
export declare const groupByClause: readonly ({
    readonly tableAlias: "otherTable";
    readonly columnAlias: "otherTableId";
} | {
    readonly tableAlias: "myTable";
    readonly columnAlias: "createdAt";
})[];
export declare const groupByClause2: readonly ({
    readonly tableAlias: "otherTable";
    readonly columnAlias: "otherTableId";
} | {
    readonly tableAlias: "myTable";
    readonly columnAlias: "createdAt";
})[];

import * as tsql from "../../../../../dist";
export declare const aliased: tsql.DerivedTableSelectItem<{
    mapper: import("type-mapping").Mapper<unknown, boolean>;
    isLateral: false;
    tableAlias: "$aliased";
    alias: "myAlias";
    columns: {
        readonly and: tsql.Column<{
            tableAlias: "myAlias";
            columnAlias: "and";
            mapper: import("type-mapping").Mapper<unknown, boolean>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    isAggregate: false;
}>;

import * as tsql from "../../../../../dist";
export declare const aliased: tsql.DerivedTable<{
    isLateral: false;
    alias: "myAlias";
    columns: {
        readonly and: tsql.Column<{
            tableAlias: "myAlias";
            columnAlias: "and";
            mapper: import("type-mapping").Mapper<unknown, boolean>;
        }>;
        readonly and2: tsql.Column<{
            tableAlias: "myAlias";
            columnAlias: "and2";
            mapper: import("type-mapping").Mapper<unknown, boolean>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
}>;

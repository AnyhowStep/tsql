import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const aliased: tsql.DerivedTable<{
    isLateral: false;
    alias: "myAlias";
    columns: {
        readonly myTableId: tsql.Column<{
            tableAlias: "myAlias";
            columnAlias: "myTableId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
}>;

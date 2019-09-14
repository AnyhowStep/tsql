import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const aliased: tsql.DerivedTableSelectItem<{
    mapper: tm.Mapper<unknown, bigint | null>;
    isLateral: false;
    tableAlias: "__aliased";
    alias: "myAlias";
    columns: {
        readonly myTableId: tsql.Column<{
            tableAlias: "myAlias";
            columnAlias: "myTableId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
    };
    usedRef: tsql.IUsedRef<{
        outerQueryOfAs: {
            someColumnOfAs: string;
        };
    }>;
}>;

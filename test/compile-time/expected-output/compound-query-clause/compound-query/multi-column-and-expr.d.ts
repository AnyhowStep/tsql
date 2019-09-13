import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const compound: {
    selectClause: [tsql.Column<{
        tableAlias: "myTable";
        columnAlias: "cqcTableId";
        mapper: tm.Mapper<unknown, bigint>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "__aliased";
        alias: "gt";
        usedRef: tsql.IUsedRef<never>;
    }>];
    compoundQueryClause: readonly tsql.CompoundQuery[];
};

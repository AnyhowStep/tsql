import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const compound: {
    selectClause: [tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, number | null>;
        tableAlias: "__aliased";
        alias: "y";
        usedRef: tsql.IUsedRef<never>;
    }>];
    compoundQueryClause: readonly tsql.CompoundQuery[];
};

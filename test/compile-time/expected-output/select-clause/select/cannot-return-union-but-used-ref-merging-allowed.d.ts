import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const selectClause: [tsql.IExprSelectItem<{
    mapper: tm.Mapper<unknown, boolean>; /**
     * The two `SelectsT` have different `usedRef` but the first
     * is a subset of the second.
     */
    tableAlias: "__aliased";
    alias: "eq";
    usedRef: tsql.IUsedRef<never>;
}>];

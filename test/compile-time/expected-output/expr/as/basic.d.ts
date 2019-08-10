import * as tsql from "../../../../../dist";
export declare const expr: tsql.ExprImpl<import("type-mapping").Mapper<unknown, boolean>, tsql.IUsedRef<{}>>;
export declare const aliasedExprA: tsql.ExprUtil.AliasedExpr<{
    mapper: import("type-mapping").Mapper<unknown, boolean>;
    tableAlias: "__aliased";
    alias: "a";
    usedRef: tsql.IUsedRef<{}>;
}>;
export declare const aliasedExprB: tsql.ExprUtil.AliasedExpr<{
    mapper: import("type-mapping").Mapper<unknown, boolean>;
    tableAlias: "__aliased";
    alias: "b";
    usedRef: tsql.IUsedRef<{}>;
}>;

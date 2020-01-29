import * as tsql from "../../../../../dist";
export declare const expr: tsql.ExprImpl<boolean, tsql.IUsedRef<{}>, false>;
export declare const aliasedExprA: tsql.AliasedExpr<{
    mapper: import("type-mapping").Mapper<unknown, boolean>;
    tableAlias: "$aliased";
    alias: "a";
    usedRef: tsql.IUsedRef<{}>;
    isAggregate: false;
}>;
export declare const aliasedExprB: tsql.AliasedExpr<{
    mapper: import("type-mapping").Mapper<unknown, boolean>;
    tableAlias: "$aliased";
    alias: "b";
    usedRef: tsql.IUsedRef<{}>;
    isAggregate: false;
}>;

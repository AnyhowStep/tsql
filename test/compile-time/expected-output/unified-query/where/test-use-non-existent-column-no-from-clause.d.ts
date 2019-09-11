import * as tsql from "../../../../../dist";
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: undefined;
    }>;
    selectClause: undefined;
    limitClause: undefined;
    unionClause: undefined;
    unionLimitClause: undefined;
}>;
declare type AllowedUsedRef = tsql.FromClauseUtil.AllowedUsedRef<typeof query["fromClause"], {
    isLateral: true;
}>;
declare type AllowedExpr = tsql.IExpr<{
    mapper: () => boolean;
    usedRef: AllowedUsedRef;
}>;
export declare const notAllowed: AllowedExpr;
export {};

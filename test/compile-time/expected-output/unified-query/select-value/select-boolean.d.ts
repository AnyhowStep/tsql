import * as tsql from "../../../../../dist";
export declare const q: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: undefined;
    }>;
    selectClause: [tsql.IExprSelectItem<{
        mapper: import("type-mapping").Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "value";
        usedRef: tsql.IUsedRef<never>;
        isAggregate: false;
    }>];
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: undefined;
    groupByClause: undefined;
}>;

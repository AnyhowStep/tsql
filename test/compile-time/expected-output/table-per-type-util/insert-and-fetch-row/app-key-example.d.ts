import * as tsql from "../../../../../dist";
export declare const browser: {
    readonly key: tsql.CustomExpr_NonCorrelated_NonAggregate<string>;
    readonly appId: tsql.CustomExpr_NonCorrelated_NonAggregate<bigint>;
} & {
    readonly disabledAt?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<Date | null>;
    readonly createdAt?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<Date>;
    readonly referer?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<string | null>;
} & {};
export declare const server: {
    readonly key: tsql.CustomExpr_NonCorrelated_NonAggregate<string>;
    readonly appId: tsql.CustomExpr_NonCorrelated_NonAggregate<bigint>;
} & {
    readonly disabledAt?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<Date | null>;
    readonly createdAt?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<Date>;
    readonly ipAddress?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<string | null>;
    readonly trustProxy?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<boolean>;
} & {};

import * as tsql from "../../../../../dist";
export declare const cat: {
    readonly appId: tsql.CustomExpr_NonCorrelated_NonAggregate<bigint>;
    readonly name: tsql.CustomExpr_NonCorrelated_NonAggregate<string>;
} & {
    readonly createdAt?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<Date>;
    readonly extinctAt?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<Date | null>;
    readonly purrFrequency?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<number | null>;
} & {};
export declare const dog: {
    readonly appId: tsql.CustomExpr_NonCorrelated_NonAggregate<bigint>;
    readonly name: tsql.CustomExpr_NonCorrelated_NonAggregate<string>;
} & {
    readonly createdAt?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<Date>;
    readonly extinctAt?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<Date | null>;
    readonly barksPerMinute?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<bigint | null>;
} & {};
export declare const catDog: {
    readonly appId: tsql.CustomExpr_NonCorrelated_NonAggregate<bigint>;
    readonly name: tsql.CustomExpr_NonCorrelated_NonAggregate<string>;
    readonly headsOnSameEndOfBody: tsql.CustomExpr_NonCorrelated_NonAggregate<boolean>;
} & {
    readonly createdAt?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<Date>;
    readonly extinctAt?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<Date | null>;
    readonly purrFrequency?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<number | null>;
    readonly barksPerMinute?: tsql.CustomExpr_NonCorrelated_NonAggregateOrUndefined<bigint | null>;
} & {};

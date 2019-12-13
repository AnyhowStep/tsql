import * as tsql from "../../../../../dist";
export declare const cat: {
    readonly appId: tsql.CustomExpr_NonCorrelated<bigint>;
    readonly name: tsql.CustomExpr_NonCorrelated<string>;
} & {
    readonly createdAt?: tsql.CustomExpr_NonCorrelatedOrUndefined<Date>;
    readonly extinctAt?: tsql.CustomExpr_NonCorrelatedOrUndefined<Date | null>;
    readonly purrFrequency?: tsql.CustomExpr_NonCorrelatedOrUndefined<number | null>;
} & {};
export declare const dog: {
    readonly appId: tsql.CustomExpr_NonCorrelated<bigint>;
    readonly name: tsql.CustomExpr_NonCorrelated<string>;
} & {
    readonly createdAt?: tsql.CustomExpr_NonCorrelatedOrUndefined<Date>;
    readonly extinctAt?: tsql.CustomExpr_NonCorrelatedOrUndefined<Date | null>;
    readonly barksPerMinute?: tsql.CustomExpr_NonCorrelatedOrUndefined<bigint | null>;
} & {};
export declare const catDog: {
    readonly appId: tsql.CustomExpr_NonCorrelated<bigint>;
    readonly name: tsql.CustomExpr_NonCorrelated<string>;
    readonly headsOnSameEndOfBody: tsql.CustomExpr_NonCorrelated<boolean>;
} & {
    readonly createdAt?: tsql.CustomExpr_NonCorrelatedOrUndefined<Date>;
    readonly extinctAt?: tsql.CustomExpr_NonCorrelatedOrUndefined<Date | null>;
    readonly purrFrequency?: tsql.CustomExpr_NonCorrelatedOrUndefined<number | null>;
    readonly barksPerMinute?: tsql.CustomExpr_NonCorrelatedOrUndefined<bigint | null>;
} & {};

import * as tsql from "../../../../../dist";
export declare const cardCustomerPayInMethod: {
    readonly name: tsql.BuiltInExpr_NonCorrelated<string>;
    readonly sansitiveInformation: tsql.BuiltInExpr_NonCorrelated<string>;
} & {} & {
    readonly payInMethodId: tsql.CustomExpr_NonCorrelated<bigint>;
    readonly platformId: tsql.CustomExpr_NonCorrelated<bigint>;
};

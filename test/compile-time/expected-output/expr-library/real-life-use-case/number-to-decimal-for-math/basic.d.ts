import * as tsql from "../../../../../../dist";
/**
 * Similar situation encountered for money-related calculations.
 */
export declare const payInMethodTypeFeeAmount: tsql.ExprImpl<bigint | null, tsql.IUsedRef<{
    readonly numberTable: {
        readonly baseAmount: number;
        readonly otherBaseAmount: bigint;
        readonly ratio: number;
    };
}>, false>;

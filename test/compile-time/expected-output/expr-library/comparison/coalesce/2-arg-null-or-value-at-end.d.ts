import * as tsql from "../../../../../../dist";
export declare const expr0: tsql.ExprImpl<true, tsql.IUsedRef<{}>, false>;
export declare const expr1: tsql.ExprImpl<"hi" | null, tsql.IUsedRef<{}>, false>;
export declare const expr2: tsql.ExprImpl<1 | "hi" | null, tsql.IUsedRef<{}>, false>;
export declare const expr3: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly myTable: {
        readonly someColumnA: boolean;
    };
}>, false>;
export declare const expr4: tsql.ExprImpl<boolean | "hi" | null, tsql.IUsedRef<{
    readonly myTable: {
        readonly someColumnA: boolean;
        readonly someColumnB: boolean;
    };
}>, false>;

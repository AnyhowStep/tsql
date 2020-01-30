import * as tsql from "../../../../../../dist";
export declare const expr0: tsql.ExprImpl<true, tsql.IUsedRef<{}>, false>;
export declare const expr1: tsql.ExprImpl<null, tsql.IUsedRef<{}>, false>;
export declare const expr2: tsql.ExprImpl<1 | null, tsql.IUsedRef<{}>, false>;
export declare const expr3: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly myTable: {
        readonly someColumnA: boolean;
    };
}>, false>;
export declare const expr4: tsql.ExprImpl<boolean | null, tsql.IUsedRef<{
    readonly myTable: {
        readonly someColumnA: boolean;
        readonly someColumnB: boolean;
    };
}>, false>;

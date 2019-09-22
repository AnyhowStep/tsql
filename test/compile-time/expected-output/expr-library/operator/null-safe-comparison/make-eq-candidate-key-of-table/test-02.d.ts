import * as tsql from "../../../../../../../dist";
export declare const expr: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly myTable: {
        readonly outerTableIdA: bigint;
        readonly outerTableIdB: boolean;
        readonly outerColumn: string;
        readonly otherColumn: string;
    };
    readonly outerTable: {
        readonly outerTableIdA: bigint;
        readonly outerTableIdB: boolean;
        readonly outerColumn: string;
    };
}>>;

import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";
export declare const expr: tsql.AliasedExpr<{
    mapper: tm.Mapper<unknown, string>;
    tableAlias: "$aliased";
    alias: "greetings";
    usedRef: tsql.IUsedRef<{
        readonly test: {
            readonly testVal: string;
        };
    }>;
    isAggregate: false;
}>;

import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../dist";
export declare const expr0: tsql.ExprImpl<tm.Mapper<unknown, string | boolean | Buffer | 9001>, tsql.IUsedRef<{
    readonly myTable: {
        readonly someColumnA: boolean | null;
        readonly someColumnB: string | null;
        readonly someColumnC: Buffer | null;
    };
}>>;

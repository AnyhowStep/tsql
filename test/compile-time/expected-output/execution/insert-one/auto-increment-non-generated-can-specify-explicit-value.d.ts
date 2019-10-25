import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
export declare const p: Promise<tsql.ExecutionUtil.InsertOneResultWithAutoIncrement<tsql.Table<{
    isLateral: false;
    alias: "test";
    columns: {
        readonly testId: tsql.Column<{
            tableAlias: "test";
            columnAlias: "testId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly testVal: tsql.Column<{
            tableAlias: "test";
            columnAlias: "testVal";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "testId";
    id: "testId";
    primaryKey: readonly "testId"[];
    candidateKeys: readonly (readonly "testId"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly never[];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly never[];
    mutableColumns: readonly never[];
}>>>;

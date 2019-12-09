import * as tsql from "../../../../../dist";
export declare const bTpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "atwcmbmB";
        columns: {
            readonly x: tsql.Column<{
                tableAlias: "atwcmbmB";
                columnAlias: "x";
                mapper: import("type-mapping").Mapper<unknown, bigint | null>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: undefined;
        primaryKey: undefined;
        candidateKeys: readonly [];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: "x"[];
        explicitDefaultValueColumns: readonly [];
        mutableColumns: readonly "x"[];
        explicitAutoIncrementValueEnabled: false;
    }>;
    parentTables: readonly tsql.Table<{
        isLateral: false;
        alias: "atwcmbmA";
        columns: {
            readonly x: tsql.Column<{
                tableAlias: "atwcmbmA";
                columnAlias: "x";
                mapper: import("type-mapping").Mapper<unknown, bigint | null>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: undefined;
        primaryKey: undefined;
        candidateKeys: readonly [];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: "x"[];
        explicitDefaultValueColumns: readonly [];
        mutableColumns: readonly "x"[];
        explicitAutoIncrementValueEnabled: false;
    }>[];
    autoIncrement: readonly never[];
    explicitAutoIncrementValueEnabled: readonly never[];
    childInsertAndFetchCandidateKeys: readonly never[];
    parentInsertAndFetchCandidateKeys: readonly never[];
}>;
export declare const cTpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "atwcmbmC";
        columns: {
            readonly x: tsql.Column<{
                tableAlias: "atwcmbmC";
                columnAlias: "x";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: undefined;
        primaryKey: undefined;
        candidateKeys: readonly [];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly [];
        mutableColumns: readonly "x"[];
        explicitAutoIncrementValueEnabled: false;
    }>;
    parentTables: readonly (tsql.Table<{
        isLateral: false;
        alias: "atwcmbmA";
        columns: {
            readonly x: tsql.Column<{
                tableAlias: "atwcmbmA";
                columnAlias: "x";
                mapper: import("type-mapping").Mapper<unknown, bigint | null>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: undefined;
        primaryKey: undefined;
        candidateKeys: readonly [];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: "x"[];
        explicitDefaultValueColumns: readonly [];
        mutableColumns: readonly "x"[];
        explicitAutoIncrementValueEnabled: false;
    }> | tsql.Table<{
        isLateral: false;
        alias: "atwcmbmB";
        columns: {
            readonly x: tsql.Column<{
                tableAlias: "atwcmbmB";
                columnAlias: "x";
                mapper: import("type-mapping").Mapper<unknown, bigint | null>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: undefined;
        primaryKey: undefined;
        candidateKeys: readonly [];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: "x"[];
        explicitDefaultValueColumns: readonly [];
        mutableColumns: readonly "x"[];
        explicitAutoIncrementValueEnabled: false;
    }>)[];
    autoIncrement: readonly never[];
    explicitAutoIncrementValueEnabled: readonly never[];
    childInsertAndFetchCandidateKeys: readonly never[];
    parentInsertAndFetchCandidateKeys: readonly never[];
}>;
export declare const bNullable: "x"[];
export declare const cNullable: never[];

import * as tsql from "../../../../../dist";
export declare const bTpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "atwcmbmB";
        columns: {
            readonly x: tsql.Column<{
                tableAlias: "atwcmbmB";
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
    }>;
    parentTables: readonly tsql.Table<{
        isLateral: false;
        alias: "atwcmbmA";
        columns: {
            readonly x: tsql.Column<{
                tableAlias: "atwcmbmA";
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
    }>[];
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
        mutableColumns: readonly [];
    }>;
    parentTables: readonly (tsql.Table<{
        isLateral: false;
        alias: "atwcmbmA";
        columns: {
            readonly x: tsql.Column<{
                tableAlias: "atwcmbmA";
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
    }> | tsql.Table<{
        isLateral: false;
        alias: "atwcmbmB";
        columns: {
            readonly x: tsql.Column<{
                tableAlias: "atwcmbmB";
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
    }>)[];
}>;
export declare const bMutable: "x"[];
export declare const cMutable: never[];

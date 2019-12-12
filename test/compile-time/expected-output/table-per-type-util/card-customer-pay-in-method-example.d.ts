import * as tsql from "../../../../dist";
export declare const customerPayInMethod: tsql.Table<{
    isLateral: false;
    alias: "customerPayInMethod";
    columns: {
        readonly name: tsql.Column<{
            tableAlias: "customerPayInMethod";
            columnAlias: "name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly payInMethodId: tsql.Column<{
            tableAlias: "customerPayInMethod";
            columnAlias: "payInMethodId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly platformId: tsql.Column<{
            tableAlias: "customerPayInMethod";
            columnAlias: "platformId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: undefined;
    primaryKey: readonly ("payInMethodId" | "platformId")[];
    candidateKeys: readonly (readonly ("payInMethodId" | "platformId")[] | readonly "name"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly [];
    mutableColumns: readonly "name"[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const cardCustomerPayInMethod: tsql.Table<{
    isLateral: false;
    alias: "cardCustomerPayInMethod";
    columns: {
        readonly payInMethodId: tsql.Column<{
            tableAlias: "cardCustomerPayInMethod";
            columnAlias: "payInMethodId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly platformId: tsql.Column<{
            tableAlias: "cardCustomerPayInMethod";
            columnAlias: "platformId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly sansitiveInformation: tsql.Column<{
            tableAlias: "cardCustomerPayInMethod";
            columnAlias: "sansitiveInformation";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: undefined;
    primaryKey: readonly ("payInMethodId" | "platformId")[];
    candidateKeys: readonly (readonly ("payInMethodId" | "platformId")[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly [];
    mutableColumns: readonly [];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const cardCustomerPayInMethodTpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "cardCustomerPayInMethod";
        columns: {
            readonly payInMethodId: tsql.Column<{
                tableAlias: "cardCustomerPayInMethod";
                columnAlias: "payInMethodId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly platformId: tsql.Column<{
                tableAlias: "cardCustomerPayInMethod";
                columnAlias: "platformId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly sansitiveInformation: tsql.Column<{
                tableAlias: "cardCustomerPayInMethod";
                columnAlias: "sansitiveInformation";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: undefined;
        primaryKey: readonly ("payInMethodId" | "platformId")[];
        candidateKeys: readonly (readonly ("payInMethodId" | "platformId")[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly [];
        mutableColumns: readonly [];
        explicitAutoIncrementValueEnabled: false;
    }>;
    parentTables: readonly tsql.Table<{
        isLateral: false;
        alias: "customerPayInMethod";
        columns: {
            readonly name: tsql.Column<{
                tableAlias: "customerPayInMethod";
                columnAlias: "name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
            readonly payInMethodId: tsql.Column<{
                tableAlias: "customerPayInMethod";
                columnAlias: "payInMethodId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly platformId: tsql.Column<{
                tableAlias: "customerPayInMethod";
                columnAlias: "platformId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: undefined;
        primaryKey: readonly ("payInMethodId" | "platformId")[];
        candidateKeys: readonly (readonly ("payInMethodId" | "platformId")[] | readonly "name"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly [];
        mutableColumns: readonly "name"[];
        explicitAutoIncrementValueEnabled: false;
    }>[];
    autoIncrement: readonly never[];
    explicitAutoIncrementValueEnabled: readonly never[];
    insertAndFetchPrimaryKey: readonly ("payInMethodId" | "platformId")[];
}>;

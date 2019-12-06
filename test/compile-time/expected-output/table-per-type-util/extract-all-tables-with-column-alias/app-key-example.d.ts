import * as tsql from "../../../../../dist";
export declare const browser_appKeyId: tsql.Table<{
    isLateral: false;
    alias: "appKey";
    columns: {
        readonly key: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "key";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly appId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly appKeyId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appKeyId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly disabledAt: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "disabledAt";
            mapper: import("type-mapping").Mapper<unknown, Date | null>;
        }>;
        readonly createdAt: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly appKeyTypeId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appKeyTypeId";
            mapper: import("type-mapping").Mapper<unknown, import("../app-key-example").AppKeyTypeId>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "appKeyId";
    id: "appKeyId";
    primaryKey: readonly "appKeyId"[];
    candidateKeys: readonly (readonly "appKeyId"[] | readonly "key"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "appKeyId"[];
    nullableColumns: "disabledAt"[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly ("key" | "disabledAt")[];
}> | tsql.Table<{
    isLateral: false;
    alias: "browserAppKey";
    columns: {
        readonly appKeyId: tsql.Column<{
            tableAlias: "browserAppKey";
            columnAlias: "appKeyId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly appKeyTypeId: tsql.Column<{
            tableAlias: "browserAppKey";
            columnAlias: "appKeyTypeId";
            mapper: import("type-mapping").Mapper<unknown, import("../app-key-example").AppKeyTypeId.BROWSER>;
        }>;
        readonly referer: tsql.Column<{
            tableAlias: "browserAppKey";
            columnAlias: "referer";
            mapper: import("type-mapping").Mapper<unknown, string | null>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: "appKeyId";
    primaryKey: readonly "appKeyId"[];
    candidateKeys: readonly (readonly "appKeyId"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "appKeyTypeId"[];
    nullableColumns: "referer"[];
    explicitDefaultValueColumns: readonly never[];
    mutableColumns: readonly "referer"[];
}>;
export declare const server_appKeyId: tsql.Table<{
    isLateral: false;
    alias: "appKey";
    columns: {
        readonly key: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "key";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly appId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly appKeyId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appKeyId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly disabledAt: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "disabledAt";
            mapper: import("type-mapping").Mapper<unknown, Date | null>;
        }>;
        readonly createdAt: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly appKeyTypeId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appKeyTypeId";
            mapper: import("type-mapping").Mapper<unknown, import("../app-key-example").AppKeyTypeId>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "appKeyId";
    id: "appKeyId";
    primaryKey: readonly "appKeyId"[];
    candidateKeys: readonly (readonly "appKeyId"[] | readonly "key"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "appKeyId"[];
    nullableColumns: "disabledAt"[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly ("key" | "disabledAt")[];
}> | tsql.Table<{
    isLateral: false;
    alias: "serverAppKey";
    columns: {
        readonly appKeyId: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "appKeyId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly appKeyTypeId: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "appKeyTypeId";
            mapper: import("type-mapping").Mapper<unknown, import("../app-key-example").AppKeyTypeId.SERVER>;
        }>;
        readonly ipAddress: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "ipAddress";
            mapper: import("type-mapping").Mapper<unknown, string | null>;
        }>;
        readonly trustProxy: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "trustProxy";
            mapper: import("type-mapping").Mapper<unknown, boolean>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: "appKeyId";
    primaryKey: readonly "appKeyId"[];
    candidateKeys: readonly (readonly "appKeyId"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "appKeyTypeId"[];
    nullableColumns: "ipAddress"[];
    explicitDefaultValueColumns: readonly "trustProxy"[];
    mutableColumns: readonly ("ipAddress" | "trustProxy")[];
}>;
export declare const browser_createdAt: tsql.Table<{
    isLateral: false;
    alias: "appKey";
    columns: {
        readonly key: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "key";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly appId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly appKeyId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appKeyId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly disabledAt: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "disabledAt";
            mapper: import("type-mapping").Mapper<unknown, Date | null>;
        }>;
        readonly createdAt: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly appKeyTypeId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appKeyTypeId";
            mapper: import("type-mapping").Mapper<unknown, import("../app-key-example").AppKeyTypeId>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "appKeyId";
    id: "appKeyId";
    primaryKey: readonly "appKeyId"[];
    candidateKeys: readonly (readonly "appKeyId"[] | readonly "key"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "appKeyId"[];
    nullableColumns: "disabledAt"[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly ("key" | "disabledAt")[];
}>;
export declare const server_createdAt: tsql.Table<{
    isLateral: false;
    alias: "appKey";
    columns: {
        readonly key: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "key";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly appId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly appKeyId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appKeyId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly disabledAt: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "disabledAt";
            mapper: import("type-mapping").Mapper<unknown, Date | null>;
        }>;
        readonly createdAt: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly appKeyTypeId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appKeyTypeId";
            mapper: import("type-mapping").Mapper<unknown, import("../app-key-example").AppKeyTypeId>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "appKeyId";
    id: "appKeyId";
    primaryKey: readonly "appKeyId"[];
    candidateKeys: readonly (readonly "appKeyId"[] | readonly "key"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "appKeyId"[];
    nullableColumns: "disabledAt"[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly ("key" | "disabledAt")[];
}>;
export declare const browser_referer: tsql.Table<{
    isLateral: false;
    alias: "browserAppKey";
    columns: {
        readonly appKeyId: tsql.Column<{
            tableAlias: "browserAppKey";
            columnAlias: "appKeyId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly appKeyTypeId: tsql.Column<{
            tableAlias: "browserAppKey";
            columnAlias: "appKeyTypeId";
            mapper: import("type-mapping").Mapper<unknown, import("../app-key-example").AppKeyTypeId.BROWSER>;
        }>;
        readonly referer: tsql.Column<{
            tableAlias: "browserAppKey";
            columnAlias: "referer";
            mapper: import("type-mapping").Mapper<unknown, string | null>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: "appKeyId";
    primaryKey: readonly "appKeyId"[];
    candidateKeys: readonly (readonly "appKeyId"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "appKeyTypeId"[];
    nullableColumns: "referer"[];
    explicitDefaultValueColumns: readonly never[];
    mutableColumns: readonly "referer"[];
}>;
export declare const server_trustProxy: tsql.Table<{
    isLateral: false;
    alias: "serverAppKey";
    columns: {
        readonly appKeyId: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "appKeyId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly appKeyTypeId: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "appKeyTypeId";
            mapper: import("type-mapping").Mapper<unknown, import("../app-key-example").AppKeyTypeId.SERVER>;
        }>;
        readonly ipAddress: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "ipAddress";
            mapper: import("type-mapping").Mapper<unknown, string | null>;
        }>;
        readonly trustProxy: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "trustProxy";
            mapper: import("type-mapping").Mapper<unknown, boolean>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: "appKeyId";
    primaryKey: readonly "appKeyId"[];
    candidateKeys: readonly (readonly "appKeyId"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "appKeyTypeId"[];
    nullableColumns: "ipAddress"[];
    explicitDefaultValueColumns: readonly "trustProxy"[];
    mutableColumns: readonly ("ipAddress" | "trustProxy")[];
}>;
export declare const browser_doesNotExist: never;
export declare const server_doesNotExist: never;

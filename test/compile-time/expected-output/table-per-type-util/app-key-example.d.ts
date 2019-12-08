import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../dist";
export declare enum AppKeyTypeId {
    SERVER = 1,
    BROWSER = 2
}
export declare const appKey: tsql.Table<{
    isLateral: false;
    alias: "appKey";
    columns: {
        readonly key: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "key";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly appId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly appKeyId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appKeyId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly disabledAt: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "disabledAt";
            mapper: tm.Mapper<unknown, Date | null>;
        }>;
        readonly createdAt: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "createdAt";
            mapper: tm.Mapper<unknown, Date>;
        }>;
        readonly appKeyTypeId: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "appKeyTypeId";
            mapper: tm.Mapper<unknown, AppKeyTypeId>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "appKeyId";
    id: "appKeyId";
    primaryKey: readonly "appKeyId"[];
    candidateKeys: readonly (readonly "appKeyId"[] | readonly "key"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly never[];
    nullableColumns: "disabledAt"[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly ("key" | "disabledAt")[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const browserAppKey: tsql.Table<{
    isLateral: false;
    alias: "browserAppKey";
    columns: {
        readonly appKeyId: tsql.Column<{
            tableAlias: "browserAppKey";
            columnAlias: "appKeyId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly appKeyTypeId: tsql.Column<{
            tableAlias: "browserAppKey";
            columnAlias: "appKeyTypeId";
            mapper: tm.Mapper<unknown, AppKeyTypeId.BROWSER>;
        }>;
        readonly referer: tsql.Column<{
            tableAlias: "browserAppKey";
            columnAlias: "referer";
            mapper: tm.Mapper<unknown, string | null>;
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
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const serverAppKey: tsql.Table<{
    isLateral: false;
    alias: "serverAppKey";
    columns: {
        readonly appKeyId: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "appKeyId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly appKeyTypeId: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "appKeyTypeId";
            mapper: tm.Mapper<unknown, AppKeyTypeId.SERVER>;
        }>;
        readonly ipAddress: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "ipAddress";
            mapper: tm.Mapper<unknown, string | null>;
        }>;
        readonly trustProxy: tsql.Column<{
            tableAlias: "serverAppKey";
            columnAlias: "trustProxy";
            mapper: tm.Mapper<unknown, boolean>;
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
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const browserAppKeyTpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "browserAppKey";
        columns: {
            readonly appKeyId: tsql.Column<{
                tableAlias: "browserAppKey";
                columnAlias: "appKeyId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly appKeyTypeId: tsql.Column<{
                tableAlias: "browserAppKey";
                columnAlias: "appKeyTypeId";
                mapper: tm.Mapper<unknown, AppKeyTypeId.BROWSER>;
            }>;
            readonly referer: tsql.Column<{
                tableAlias: "browserAppKey";
                columnAlias: "referer";
                mapper: tm.Mapper<unknown, string | null>;
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
        explicitAutoIncrementValueEnabled: false;
    }>;
    parentTables: readonly tsql.Table<{
        isLateral: false;
        alias: "appKey";
        columns: {
            readonly key: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "key";
                mapper: tm.Mapper<unknown, string>;
            }>;
            readonly appId: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "appId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly appKeyId: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "appKeyId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly disabledAt: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "disabledAt";
                mapper: tm.Mapper<unknown, Date | null>;
            }>;
            readonly createdAt: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "createdAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
            readonly appKeyTypeId: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "appKeyTypeId";
                mapper: tm.Mapper<unknown, AppKeyTypeId>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "appKeyId";
        id: "appKeyId";
        primaryKey: readonly "appKeyId"[];
        candidateKeys: readonly (readonly "appKeyId"[] | readonly "key"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: "disabledAt"[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly ("key" | "disabledAt")[];
        explicitAutoIncrementValueEnabled: false;
    }>[];
    autoIncrement: readonly "appKeyId"[];
    explicitAutoIncrementValueEnabled: readonly never[];
}>;
export declare const serverAppKeyTpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "serverAppKey";
        columns: {
            readonly appKeyId: tsql.Column<{
                tableAlias: "serverAppKey";
                columnAlias: "appKeyId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly appKeyTypeId: tsql.Column<{
                tableAlias: "serverAppKey";
                columnAlias: "appKeyTypeId";
                mapper: tm.Mapper<unknown, AppKeyTypeId.SERVER>;
            }>;
            readonly ipAddress: tsql.Column<{
                tableAlias: "serverAppKey";
                columnAlias: "ipAddress";
                mapper: tm.Mapper<unknown, string | null>;
            }>;
            readonly trustProxy: tsql.Column<{
                tableAlias: "serverAppKey";
                columnAlias: "trustProxy";
                mapper: tm.Mapper<unknown, boolean>;
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
        explicitAutoIncrementValueEnabled: false;
    }>;
    parentTables: readonly tsql.Table<{
        isLateral: false;
        alias: "appKey";
        columns: {
            readonly key: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "key";
                mapper: tm.Mapper<unknown, string>;
            }>;
            readonly appId: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "appId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly appKeyId: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "appKeyId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly disabledAt: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "disabledAt";
                mapper: tm.Mapper<unknown, Date | null>;
            }>;
            readonly createdAt: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "createdAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
            readonly appKeyTypeId: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "appKeyTypeId";
                mapper: tm.Mapper<unknown, AppKeyTypeId>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "appKeyId";
        id: "appKeyId";
        primaryKey: readonly "appKeyId"[];
        candidateKeys: readonly (readonly "appKeyId"[] | readonly "key"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: "disabledAt"[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly ("key" | "disabledAt")[];
        explicitAutoIncrementValueEnabled: false;
    }>[];
    autoIncrement: readonly "appKeyId"[];
    explicitAutoIncrementValueEnabled: readonly never[];
}>;

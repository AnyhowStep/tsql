import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
export declare const business: tsql.Table<{
    isLateral: false;
    alias: "business";
    columns: {
        readonly appId: tsql.Column<{
            tableAlias: "business";
            columnAlias: "appId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly businessId: tsql.Column<{
            tableAlias: "business";
            columnAlias: "businessId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly rwc_be_createdAt: tsql.Column<{
            tableAlias: "business";
            columnAlias: "rwc_be_createdAt";
            mapper: tm.Mapper<unknown, Date>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "businessId";
    id: "businessId";
    primaryKey: readonly "businessId"[];
    candidateKeys: readonly (readonly "businessId"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "businessId"[];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly "rwc_be_createdAt"[];
    mutableColumns: readonly [];
}>;
export declare const businessEnabled: tsql.Table<{
    isLateral: false;
    alias: "businessEnabled";
    columns: {
        readonly enabled: tsql.Column<{
            tableAlias: "businessEnabled";
            columnAlias: "enabled";
            mapper: tm.Mapper<unknown, boolean>;
        }>;
        readonly appId: tsql.Column<{
            tableAlias: "businessEnabled";
            columnAlias: "appId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly businessId: tsql.Column<{
            tableAlias: "businessEnabled";
            columnAlias: "businessId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly businessEnabledId: tsql.Column<{
            tableAlias: "businessEnabled";
            columnAlias: "businessEnabledId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly updatedAt: tsql.Column<{
            tableAlias: "businessEnabled";
            columnAlias: "updatedAt";
            mapper: tm.Mapper<unknown, Date>;
        }>;
        readonly updatedByExternalUserId: tsql.Column<{
            tableAlias: "businessEnabled";
            columnAlias: "updatedByExternalUserId";
            mapper: tm.Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "businessEnabledId";
    id: "businessEnabledId";
    primaryKey: readonly "businessEnabledId"[];
    candidateKeys: readonly (readonly "businessEnabledId"[] | readonly ("businessId" | "updatedAt")[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "businessEnabledId"[];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly "updatedAt"[];
    mutableColumns: readonly never[];
}>;
export declare const businessEnabledLog: tsql.Log<{
    tracked: readonly "enabled"[];
    doNotCopy: readonly "updatedByExternalUserId"[];
    copy: readonly "appId"[];
    trackedWithDefaultValue: readonly "enabled"[];
    logTable: tsql.Table<{
        isLateral: false;
        alias: "businessEnabled";
        columns: {
            readonly enabled: tsql.Column<{
                tableAlias: "businessEnabled";
                columnAlias: "enabled";
                mapper: tm.Mapper<unknown, boolean>;
            }>;
            readonly appId: tsql.Column<{
                tableAlias: "businessEnabled";
                columnAlias: "appId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly businessId: tsql.Column<{
                tableAlias: "businessEnabled";
                columnAlias: "businessId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly businessEnabledId: tsql.Column<{
                tableAlias: "businessEnabled";
                columnAlias: "businessEnabledId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly updatedAt: tsql.Column<{
                tableAlias: "businessEnabled";
                columnAlias: "updatedAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
            readonly updatedByExternalUserId: tsql.Column<{
                tableAlias: "businessEnabled";
                columnAlias: "updatedByExternalUserId";
                mapper: tm.Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "businessEnabledId";
        id: "businessEnabledId";
        primaryKey: readonly "businessEnabledId"[];
        candidateKeys: readonly (readonly "businessEnabledId"[] | readonly ("businessId" | "updatedAt")[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly "businessEnabledId"[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "updatedAt"[];
        mutableColumns: readonly never[];
    }>;
    ownerTable: tsql.Table<{
        isLateral: false;
        alias: "business";
        columns: {
            readonly appId: tsql.Column<{
                tableAlias: "business";
                columnAlias: "appId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly businessId: tsql.Column<{
                tableAlias: "business";
                columnAlias: "businessId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly rwc_be_createdAt: tsql.Column<{
                tableAlias: "business";
                columnAlias: "rwc_be_createdAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "businessId";
        id: "businessId";
        primaryKey: readonly "businessId"[];
        candidateKeys: readonly (readonly "businessId"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly "businessId"[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "rwc_be_createdAt"[];
        mutableColumns: readonly [];
    }>;
}>;

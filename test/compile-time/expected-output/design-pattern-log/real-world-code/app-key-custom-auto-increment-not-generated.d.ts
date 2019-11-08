import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
export declare const appKey: tsql.Table<{
    isLateral: false;
    alias: "appKey";
    columns: {
        readonly key: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "key";
            mapper: tm.Mapper<unknown, string>;
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
        readonly rwc_akc_createdAt: tsql.Column<{
            tableAlias: "appKey";
            columnAlias: "rwc_akc_createdAt";
            mapper: tm.Mapper<unknown, Date>;
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
    explicitDefaultValueColumns: readonly "rwc_akc_createdAt"[];
    mutableColumns: readonly ("key" | "disabledAt")[];
}>;
export declare const appKeyCustom: tsql.Table<{
    isLateral: false;
    alias: "appKeyCustom";
    columns: {
        readonly custom: tsql.Column<{
            tableAlias: "appKeyCustom";
            columnAlias: "custom";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly appKeyId: tsql.Column<{
            tableAlias: "appKeyCustom";
            columnAlias: "appKeyId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly appKeyCustomId: tsql.Column<{
            tableAlias: "appKeyCustom";
            columnAlias: "appKeyCustomId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly rwc_akc_updatedAt: tsql.Column<{
            tableAlias: "appKeyCustom";
            columnAlias: "rwc_akc_updatedAt";
            mapper: tm.Mapper<unknown, Date>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "appKeyCustomId";
    id: "appKeyCustomId";
    primaryKey: readonly "appKeyCustomId"[];
    candidateKeys: readonly (readonly "appKeyCustomId"[] | readonly ("appKeyId" | "rwc_akc_updatedAt")[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly never[];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly "rwc_akc_updatedAt"[];
    mutableColumns: readonly [];
}>;
export declare const appKeyCustomLog: tsql.Log<{
    tracked: readonly "custom"[];
    doNotCopy: readonly never[];
    copy: readonly never[];
    trackedWithDefaultValue: readonly "custom"[];
    logTable: tsql.Table<{
        isLateral: false;
        alias: "appKeyCustom";
        columns: {
            readonly custom: tsql.Column<{
                tableAlias: "appKeyCustom";
                columnAlias: "custom";
                mapper: tm.Mapper<unknown, string>;
            }>;
            readonly appKeyId: tsql.Column<{
                tableAlias: "appKeyCustom";
                columnAlias: "appKeyId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly appKeyCustomId: tsql.Column<{
                tableAlias: "appKeyCustom";
                columnAlias: "appKeyCustomId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly rwc_akc_updatedAt: tsql.Column<{
                tableAlias: "appKeyCustom";
                columnAlias: "rwc_akc_updatedAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "appKeyCustomId";
        id: "appKeyCustomId";
        primaryKey: readonly "appKeyCustomId"[];
        candidateKeys: readonly (readonly "appKeyCustomId"[] | readonly ("appKeyId" | "rwc_akc_updatedAt")[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "rwc_akc_updatedAt"[];
        mutableColumns: readonly [];
    }>;
    ownerTable: tsql.Table<{
        isLateral: false;
        alias: "appKey";
        columns: {
            readonly key: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "key";
                mapper: tm.Mapper<unknown, string>;
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
            readonly rwc_akc_createdAt: tsql.Column<{
                tableAlias: "appKey";
                columnAlias: "rwc_akc_createdAt";
                mapper: tm.Mapper<unknown, Date>;
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
        explicitDefaultValueColumns: readonly "rwc_akc_createdAt"[];
        mutableColumns: readonly ("key" | "disabledAt")[];
    }>;
    latestOrder: readonly [tsql.Column<{
        tableAlias: "appKeyCustom";
        columnAlias: "rwc_akc_updatedAt";
        mapper: tm.Mapper<unknown, Date>;
    }>, "DESC"];
}>;

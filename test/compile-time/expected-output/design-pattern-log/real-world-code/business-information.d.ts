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
        readonly countryId: tsql.Column<{
            tableAlias: "business";
            columnAlias: "countryId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly rwc_bi_createdAt: tsql.Column<{
            tableAlias: "business";
            columnAlias: "rwc_bi_createdAt";
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
    explicitDefaultValueColumns: readonly "rwc_bi_createdAt"[];
    mutableColumns: readonly [];
}>;
export declare const businessInformation: tsql.Table<{
    isLateral: false;
    alias: "businessInformation";
    columns: {
        readonly description: tsql.Column<{
            tableAlias: "businessInformation";
            columnAlias: "description";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly appId: tsql.Column<{
            tableAlias: "businessInformation";
            columnAlias: "appId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly businessId: tsql.Column<{
            tableAlias: "businessInformation";
            columnAlias: "businessId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly updatedAt: tsql.Column<{
            tableAlias: "businessInformation";
            columnAlias: "updatedAt";
            mapper: tm.Mapper<unknown, Date>;
        }>;
        readonly updatedByExternalUserId: tsql.Column<{
            tableAlias: "businessInformation";
            columnAlias: "updatedByExternalUserId";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly countryId: tsql.Column<{
            tableAlias: "businessInformation";
            columnAlias: "countryId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly businessInformationId: tsql.Column<{
            tableAlias: "businessInformation";
            columnAlias: "businessInformationId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly name: tsql.Column<{
            tableAlias: "businessInformation";
            columnAlias: "name";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly taxId: tsql.Column<{
            tableAlias: "businessInformation";
            columnAlias: "taxId";
            mapper: tm.Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "businessInformationId";
    id: "businessInformationId";
    primaryKey: readonly "businessInformationId"[];
    candidateKeys: readonly (readonly ("businessId" | "updatedAt")[] | readonly "businessInformationId"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "businessInformationId"[];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly "updatedAt"[];
    mutableColumns: readonly [];
}>;
export declare const businessInformationLog: tsql.Log<{
    tracked: readonly ("description" | "name" | "taxId")[];
    doNotCopy: readonly "updatedByExternalUserId"[];
    copy: readonly ("appId" | "countryId")[];
    trackedWithDefaultValue: readonly never[];
    logTable: tsql.Table<{
        isLateral: false;
        alias: "businessInformation";
        columns: {
            readonly description: tsql.Column<{
                tableAlias: "businessInformation";
                columnAlias: "description";
                mapper: tm.Mapper<unknown, string>;
            }>;
            readonly appId: tsql.Column<{
                tableAlias: "businessInformation";
                columnAlias: "appId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly businessId: tsql.Column<{
                tableAlias: "businessInformation";
                columnAlias: "businessId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly updatedAt: tsql.Column<{
                tableAlias: "businessInformation";
                columnAlias: "updatedAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
            readonly updatedByExternalUserId: tsql.Column<{
                tableAlias: "businessInformation";
                columnAlias: "updatedByExternalUserId";
                mapper: tm.Mapper<unknown, string>;
            }>;
            readonly countryId: tsql.Column<{
                tableAlias: "businessInformation";
                columnAlias: "countryId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly businessInformationId: tsql.Column<{
                tableAlias: "businessInformation";
                columnAlias: "businessInformationId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly name: tsql.Column<{
                tableAlias: "businessInformation";
                columnAlias: "name";
                mapper: tm.Mapper<unknown, string>;
            }>;
            readonly taxId: tsql.Column<{
                tableAlias: "businessInformation";
                columnAlias: "taxId";
                mapper: tm.Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "businessInformationId";
        id: "businessInformationId";
        primaryKey: readonly "businessInformationId"[];
        candidateKeys: readonly (readonly ("businessId" | "updatedAt")[] | readonly "businessInformationId"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly "businessInformationId"[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "updatedAt"[];
        mutableColumns: readonly [];
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
            readonly countryId: tsql.Column<{
                tableAlias: "business";
                columnAlias: "countryId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly rwc_bi_createdAt: tsql.Column<{
                tableAlias: "business";
                columnAlias: "rwc_bi_createdAt";
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
        explicitDefaultValueColumns: readonly "rwc_bi_createdAt"[];
        mutableColumns: readonly [];
    }>;
}>;

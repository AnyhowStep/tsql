import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
/**
 * This is an instance of the `Log` class.
 */
export declare const lightbulbStateLog: tsql.Log<{
    tracked: readonly "switchedOn"[];
    doNotCopy: readonly "occupantId"[];
    copy: readonly "householdId"[];
    trackedWithDefaultValue: readonly "switchedOn"[];
    logTable: tsql.Table<{
        isLateral: false;
        alias: "lightbulbState";
        columns: {
            readonly lightbulbId: tsql.Column<{
                tableAlias: "lightbulbState";
                columnAlias: "lightbulbId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly householdId: tsql.Column<{
                tableAlias: "lightbulbState";
                columnAlias: "householdId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly lightbulbStateId: tsql.Column<{
                tableAlias: "lightbulbState";
                columnAlias: "lightbulbStateId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly occupantId: tsql.Column<{
                tableAlias: "lightbulbState";
                columnAlias: "occupantId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly switchedOn: tsql.Column<{
                tableAlias: "lightbulbState";
                columnAlias: "switchedOn";
                mapper: tm.Mapper<unknown, boolean>;
            }>;
            readonly loggedAt: tsql.Column<{
                tableAlias: "lightbulbState";
                columnAlias: "loggedAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "lightbulbStateId";
        id: "lightbulbStateId";
        primaryKey: readonly "lightbulbStateId"[];
        candidateKeys: readonly (readonly "lightbulbStateId"[] | readonly ("lightbulbId" | "loggedAt")[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "loggedAt"[];
        mutableColumns: readonly never[];
        explicitAutoIncrementValueEnabled: false;
    }>;
    ownerTable: tsql.Table<{
        isLateral: false;
        alias: "lightbulb";
        columns: {
            readonly lightbulbId: tsql.Column<{
                tableAlias: "lightbulb";
                columnAlias: "lightbulbId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly householdId: tsql.Column<{
                tableAlias: "lightbulb";
                columnAlias: "householdId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
            readonly locationDescription: tsql.Column<{
                tableAlias: "lightbulb";
                columnAlias: "locationDescription";
                mapper: tm.Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "lightbulbId";
        id: "lightbulbId";
        primaryKey: readonly "lightbulbId"[];
        candidateKeys: readonly (readonly "lightbulbId"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly never[];
        mutableColumns: readonly never[];
        explicitAutoIncrementValueEnabled: false;
    }>;
    latestOrder: readonly [tsql.Column<{
        tableAlias: "lightbulbState";
        columnAlias: "loggedAt";
        mapper: tm.Mapper<unknown, Date>;
    }>, "DESC"];
}>;

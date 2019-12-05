import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../dist";

export const AppKeyTypeId = {
    SERVER  : BigInt(1) as 1n,
    BROWSER : BigInt(2) as 2n,
} as const;

export const appKey = tsql.table("appKey")
    .addColumns({
        appId : tsql.dtBigIntSigned(),
        appKeyId : tsql.dtBigIntSigned(),
        appKeyTypeId : tm.literal(AppKeyTypeId.BROWSER, AppKeyTypeId.SERVER),
        key : tsql.dtVarChar(1, 512),
        createdAt : tsql.dtDateTime(3),
        disabledAt : tsql.dtDateTime(3).orNull(),
    })
    .setAutoIncrement(c => c.appKeyId)
    .addExplicitDefaultValue(c => [c.createdAt])
    .addMutable(c => [
        c.key,
        c.disabledAt
    ])
    .addCandidateKey(c => [c.key]);

export const browserAppKey = tsql.table("browserAppKey")
    .addColumns({
        appKeyId : tsql.dtBigIntSigned(),
        appKeyTypeId : tm.literal(AppKeyTypeId.BROWSER),
        referer : tsql.dtVarChar(1, 2048).orNull(),
    })
    .setId(c => c.appKeyId)
    .addGenerated(c => [c.appKeyTypeId])
    .addMutable(c => [
        c.referer
    ]);

export const serverAppKey = tsql.table("serverAppKey")
    .addColumns({
        appKeyId : tsql.dtBigIntSigned(),
        appKeyTypeId : tm.literal(AppKeyTypeId.SERVER),
        ipAddress : tsql.dtVarChar(1, 255).orNull(),
        trustProxy : tsql.dtBoolean(),
    })
    .setId(c => c.appKeyId)
    .addGenerated(c => [c.appKeyTypeId])
    .addExplicitDefaultValue(c => [c.trustProxy])
    .addMutable(c => [
        c.ipAddress,
        c.trustProxy
    ]);

export const browserAppKeyTpt = tsql.tablePerType(browserAppKey)
    .addParent(appKey);

export const serverAppKeyTpt = tsql.tablePerType(serverAppKey)
    .addParent(appKey);

export const createAppKeyTableSql = `
CREATE TABLE appKey (
    appId INTEGER NOT NULL,
    appKeyId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    appKeyTypeId INTEGER NOT NULL,
    key VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    disabledAt DATETIME
);

CREATE TABLE browserAppKey (
    appKeyId INTEGER NOT NULL,
    appKeyTypeId INTEGER NOT NULL DEFAULT (2),
    referer VARCHAR(2048),
    FOREIGN KEY (appKeyId, appKeyTypeId) REFERENCES appKey (appKeyId, appKeyTypeId)
);

CREATE TABLE serverAppKey (
    appKeyId INTEGER NOT NULL,
    appKeyTypeId INTEGER NOT NULL DEFAULT (1),
    ipAddress VARCHAR(2048),
    trustProxy BOOLEAN NOT NULL DEFAULT (FALSE),
    FOREIGN KEY (appKeyId, appKeyTypeId) REFERENCES appKey (appKeyId, appKeyTypeId)
);
`;

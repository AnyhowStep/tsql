import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../dist";

export enum AppKeyTypeId {
    SERVER  = 1,
    BROWSER = 2,
}

export const appKey = tsql.table("appKey")
    .addColumns({
        appId : tsql.dtBigIntSigned(),
        appKeyId : tsql.dtBigIntSigned(),
        appKeyTypeId : tm.enumValue(AppKeyTypeId),
        key : tsql.dtVarChar(32, 512),
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

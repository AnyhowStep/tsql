import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

export const appKey = tsql.table("appKey")
    .addColumns({
        appKeyId : tm.mysql.bigIntSigned(),
        key : tm.mysql.varChar(),
        disabledAt : tm.mysql.dateTime().orNull(),
        rwc_akc_createdAt : tm.mysql.dateTime(),
    })
    .setAutoIncrement(c => c.appKeyId)
    .addExplicitDefaultValue(c => [c.rwc_akc_createdAt])
    .addMutable(c => [
        c.key,
        c.disabledAt
    ])
    .addCandidateKey(c => [c.key]);

export const appKeyCustom = tsql.table("appKeyCustom")
    .addColumns({
        appKeyId : tm.mysql.bigIntSigned(),
        appKeyCustomId : tm.mysql.bigIntSigned(),
        custom : tm.mysql.json(),
        rwc_akc_updatedAt : tm.mysql.dateTime(),
    })
    .setAutoIncrement(c => c.appKeyCustomId)
    .addCandidateKey(c => [c.appKeyId, c.rwc_akc_updatedAt])
    .addExplicitDefaultValue(c => [c.rwc_akc_updatedAt])
    .removeAllMutable()
    .removeGenerated(c => [c.appKeyCustomId]);

export const appKeyCustomLog = tsql.log(appKeyCustom)
    .setOwner(appKey)
    .setLatestOrder(c => c.rwc_akc_updatedAt.desc())
    .setTracked(c => [c.custom])
    .setDoNotCopy(() => [])
    .setTrackedDefaults({
        custom : "{}"
    });

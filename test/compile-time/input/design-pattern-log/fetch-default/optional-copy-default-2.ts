import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

export const business = tsql.table("business")
    .addColumns({
        appId : tm.mysql.bigIntSigned(),
        businessId : tm.mysql.bigIntSigned(),
    })
    .setAutoIncrement(c => c.businessId)
    .removeAllMutable();

export const businessEnabled = tsql.table("businessEnabled")
    .addColumns({
        appId : tm.mysql.bigIntSigned(),
        businessEnabledId : tm.mysql.bigIntSigned(),
        businessId : tm.mysql.bigIntSigned(),
        enabled : tm.mysql.boolean(),
        updatedAt : tm.mysql.dateTime(3),
        updatedByExternalUserId : tm.mysql.varChar(255),
    })
    .removeAllMutable()
    .setAutoIncrement(c => c.businessEnabledId)
    .addCandidateKey(c => [c.businessId, c.updatedAt])
    .addExplicitDefaultValue(c => [c.updatedAt, c.appId]);

export const businessEnabledLog = tsql.log(businessEnabled)
    .setOwner(business)
    .setLatestOrder(columns => columns.updatedAt.desc())
    .setTracked(columns => [columns.enabled])
    .setDoNotCopy(c => [
        c.updatedByExternalUserId
    ])
    .setCopyDefaults(async () => {
        return {
            appId : undefined,
        };
    })
    .setTrackedDefaults({
        enabled : true,
    });
export const def = businessEnabledLog
    .fetchDefault(
        null as any,
        { businessId : BigInt(2) }
    );

import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

export const business = tsql.table("business")
    .addColumns({
        appId : tm.mysql.bigIntSigned(),
        businessId : tm.mysql.bigIntSigned(),
        rwc_be_createdAt : tm.mysql.dateTime(0),
    })
    .setAutoIncrement(c => c.businessId)
    .addExplicitDefaultValue(c => [c.rwc_be_createdAt])
    .removeAllMutable();

export const businessEnabled = tsql.table("businessEnabled")
    .addColumns({
        appId : tm.mysql.bigIntSigned(),
        businessEnabledId : tm.mysql.bigIntSigned(),
        businessId : tm.mysql.bigIntSigned(),
        enabled : tm.mysql.boolean(),
        updatedAt : tm.mysql.dateTime(0),
        updatedByExternalUserId : tm.mysql.varChar(255),
    })
    .removeAllMutable()
    .setAutoIncrement(c => c.businessEnabledId)
    .addCandidateKey(c => [c.businessId, c.updatedAt])
    .addExplicitDefaultValue(c => [c.updatedAt]);

export const businessEnabledLog = tsql.log(businessEnabled)
    .setOwner(business)
    .setNewestOrder(columns => columns.updatedAt.desc())
    .setTracked(columns => [columns.enabled])
    .setDoNotCopy(c => [
        c.updatedByExternalUserId
    ])
    .setCopyDefaults(({ownerPrimaryKey, connection}) => {
        return business.fetchOneByPrimaryKey(
            connection,
            ownerPrimaryKey,
            c => [c.appId]
        );
    })
    .setTrackedDefaults({
        enabled : true,
    });

import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

export const business = tsql.table("business")
    .addColumns({
        appId : tm.mysql.bigIntSigned(),
        businessId : tm.mysql.bigIntSigned(),
        countryId : tm.mysql.bigIntSigned(),
        rwc_bi_createdAt : tm.mysql.dateTime(0),
    })
    .setAutoIncrement(c => c.businessId)
    .addExplicitDefaultValue(c => [c.rwc_bi_createdAt])
    .removeAllMutable();

export const businessInformation = tsql.table("businessInformation")
    .addColumns({
        appId : tm.mysql.bigIntSigned(),
        businessInformationId : tm.mysql.bigIntSigned(),
        businessId : tm.mysql.bigIntSigned(),
        countryId : tm.mysql.bigIntSigned(),
        name : tm.mysql.varChar(),
        description : tm.mysql.varChar(),
        taxId : tm.mysql.varChar(),
        updatedAt : tm.mysql.dateTime(0),
        updatedByExternalUserId : tm.mysql.varChar(),
    })
    .setAutoIncrement(c => c.businessInformationId)
    .addExplicitDefaultValue(c => [c.updatedAt])
    .addCandidateKey(c => [c.businessId, c.updatedAt])
    .removeAllMutable();

export const businessInformationLog = tsql.log(businessInformation)
    .setOwner(business)
    .setLatestOrder(c => c.updatedAt.desc())
    .setTracked(c => [
        c.name,
        c.description,
        c.taxId,
    ])
    .setDoNotCopy(c => [
        c.updatedByExternalUserId
    ])
    .setCopyDefaults(({ownerPrimaryKey, connection}) => {
        return business.fetchOneByPrimaryKey(
            connection,
            ownerPrimaryKey,
            c => [c.appId, c.countryId]
        );
    })
    .setTrackedDefaults({
        name : undefined,
        description : undefined,
        taxId : undefined,
    });

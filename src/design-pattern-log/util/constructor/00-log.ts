import {InsertableTable} from "../../../table";
import {LogMustSetOwner} from "./01-set-owner";

export function log<LogTableT extends InsertableTable> (
    logTable : LogTableT
) : (
    LogMustSetOwner<{
        logTable : LogTableT,
    }>
) {
    return new LogMustSetOwner<{
        logTable : LogTableT,
    }>({
        logTable,
    });
}

/*
import {table} from "../../../table";
import * as tm from "type-mapping";
import {KeyArrayUtil} from "../../../key";
import {Identity} from "../../../type-util";
import {from, requireOuterQueryJoins} from "../../../unified-query";
import {eqPrimaryKeyOfTable} from "../../../expr-library";

export const businessFile = table("businessFile")
    .addColumns({
        appId : tm.mysql.bigIntSigned(),
        businessFileId : tm.mysql.bigIntSigned(),
        awsS3PresignedUploadId : tm.mysql.bigIntSigned(),
        businessId : tm.mysql.bigIntSigned(),
        externalUserId : tm.mysql.varChar(),
        fileTypeId : tm.mysql.bigIntSigned(),
        updatedAt : tm.mysql.dateTime(),
        updatedAt2 : tm.mysql.dateTime(),
        updatedByExternalUserId : tm.mysql.varChar().orNull(),
    })
    .setAutoIncrement(c => c.businessFileId)
    .addCandidateKey(c => [
        c.businessId,
        c.fileTypeId,
        c.updatedAt,
    ])
    .addCandidateKey(c => [
        c.businessId,
        c.fileTypeId,
        c.updatedAt2,
    ])
    .addExplicitDefaultValue(c => [c.updatedAt])
    .addExplicitDefaultValue(c => [c.updatedAt2])
    .removeAllMutable();

export const businessFileType = table("businessFileType")
    .addColumns({
        businessId : tm.mysql.bigIntSigned(),
        businessTypeId : tm.mysql.bigIntSigned(),
        fileTypeId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })
    .setPrimaryKey(c => [c.businessId, c.fileTypeId])
    .addExplicitDefaultValue(c => [c.createdAt])
    .removeAllMutable();

export const business = table("business")
    .addColumns({
        appId : tm.mysql.bigIntSigned(),
        businessId : tm.mysql.bigIntSigned(),
        externalUserId : tm.mysql.varChar(),
    })
    .setAutoIncrement(c => c.businessId)
    //.addExplicitDefaultValue(c => [c.createdAt])
    .removeAllMutable();

businessFile.candidateKeys
type ca = LatestOrderColumnAlias<typeof businessFile, typeof businessFileType>;
type cm = LatestOrderColumnMap<typeof businessFile, typeof businessFileType>;

const businessFileLog = log(
    {
        logTable : businessFile,
        ownerTable : businessFileType
    },
    columns => columns.updatedAt.desc(),
    columns => [columns.awsS3PresignedUploadId]
).setDoNotCopy(
    columns => [columns.updatedByExternalUserId]
).setCopyDefaults(({ownerPrimaryKey, connection}) => {
    return business.fetchOneByPrimaryKey(
        connection,
        ownerPrimaryKey,
        c => [c.appId, c.externalUserId]
    );
}).setTrackedDefaults({
    awsS3PresignedUploadId : 1n
});
businessFileLog.setDoNotCopy(columns => [])
*/

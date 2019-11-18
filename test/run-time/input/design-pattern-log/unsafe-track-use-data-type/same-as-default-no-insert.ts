import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

export const business = tsql.table("business")
    .addColumns({
        appId : tsql.dtBigIntSigned(),
        businessId : tsql.dtBigIntSigned(),
    })
    .setAutoIncrement(c => c.businessId)
    .removeAllMutable();

export const businessEnabled = tsql.table("businessEnabled")
    .addColumns({
        appId : tsql.dtBigIntSigned(),
        businessEnabledId : tsql.dtBigIntSigned(),
        businessId : tsql.dtBigIntSigned(),
        enabled : tsql.dtBoolean(),
        updatedAt : tsql.dtDateTime(3),
        updatedByExternalUserId : tsql.dtVarChar(255),
    })
    .removeAllMutable()
    .setAutoIncrement(c => c.businessEnabledId)
    .addCandidateKey(c => [c.businessId, c.updatedAt])
    .addExplicitDefaultValue(c => [c.updatedAt]);

export const businessEnabledLog = tsql.log(businessEnabled)
    .setOwner(business)
    .setLatestOrder(columns => columns.updatedAt.desc())
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

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE business (
                appId INTEGER NOT NULL,
                businessId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
            );

            CREATE TABLE businessEnabled (
                appId INTEGER NOT NULL,
                businessEnabledId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                businessId INTEGER NOT NULL,
                enabled BOOLEAN NOT NULL,
                updatedAt DATETIME NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
                updatedByExternalUserId VARCHAR(255) NOT NULL,
                FOREIGN KEY (appId, businessId) REFERENCES business (appId, businessId),
                CONSTRAINT updateRateConstraint UNIQUE (businessId, updatedAt)
            );

            INSERT INTO business(appId) VALUES
                (1),
                (1),
                (2),
                (3);
        `);

        const validationResult = await tsql.SchemaValidationUtil.validateSchema(
            [business, businessEnabled],
            (await connection.tryFetchSchemaMeta(undefined))!
        );
        t.deepEqual(validationResult.errors, []);
        t.deepEqual(validationResult.warnings, [
            {
                type: 'TABLE_ON_DATABASE_ONLY',
                description: 'Table "main"."sqlite_sequence" exists on database only',
                databaseTableAlias: 'sqlite_sequence'
            }
        ]);

        await businessEnabledLog
            .fetchLatestOrDefault(
                connection,
                { businessId : BigInt(2) }
            )
            .then((result) => {
                t.deepEqual(
                    result,
                    {
                        isDefault : true,
                        row : {
                            appId : BigInt(1),
                            businessId : BigInt(2),
                            enabled : true,
                        },
                    }
                );
            });
        const unsafeTrackResult = await businessEnabledLog.unsafeTrack(
            connection,
            { businessId : BigInt(2) },
            {
                enabled : true,
                updatedByExternalUserId : "test",
            }
        );
        t.deepEqual(
            unsafeTrackResult,
            {
                changed : false,
                previous : {
                    isDefault : true,
                    row : {
                        appId : BigInt(1),
                        businessId : BigInt(2),
                        enabled : true,
                    },
                },
            }
        );
        await businessEnabledLog
            .fetchLatestOrDefault(
                connection,
                { businessId : BigInt(2) }
            )
            .then((result) => {
                t.deepEqual(
                    result,
                    {
                        isDefault : true,
                        row : {
                            appId : BigInt(1),
                            businessId : BigInt(2),
                            enabled : true,
                        },
                    }
                );
            });
    });

    t.end();
});

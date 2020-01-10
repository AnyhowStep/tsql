import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

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
        const trackResult = await businessEnabledLog.track(
            connection,
            { businessId : BigInt(2) },
            {
                enabled : false,
                updatedByExternalUserId : "test",
            }
        );
        t.deepEqual(
            {
                ...trackResult,
                current : {
                    ...(trackResult as any).current,
                    updatedAt : undefined,
                }
            },
            {
                changed : true,
                previous : {
                    isDefault : true,
                    row : {
                        appId : BigInt(1),
                        businessId : BigInt(2),
                        enabled : true,
                    },
                },
                current : {
                    appId : BigInt(1),
                    businessEnabledId : BigInt(1),
                    businessId : BigInt(2),
                    enabled : false,
                    updatedAt : undefined,
                    updatedByExternalUserId : "test",
                },
            }
        );
        await businessEnabledLog
            .fetchLatestOrDefault(
                connection,
                { businessId : BigInt(2) }
            )
            .then(({isDefault, row}) => {
                t.deepEqual(
                    {
                        isDefault,
                        row : {
                            ...row,
                            updatedAt : undefined,
                        },
                    },
                    {
                        isDefault : false,
                        row : {
                            appId : BigInt(1),
                            businessEnabledId : BigInt(1),
                            businessId : BigInt(2),
                            enabled : false,
                            updatedAt : undefined,
                            updatedByExternalUserId : "test",
                        },
                    }
                );
            });
        const trackResult2 = await businessEnabledLog.track(
            connection,
            { businessId : BigInt(2) },
            {
                enabled : true,
                updatedByExternalUserId : "test2",
            }
        );
        t.deepEqual(
            {
                ...trackResult2,
                previous : {
                    ...trackResult2.previous,
                    row : {
                        ...trackResult2.previous.row,
                        updatedAt : undefined,
                    }
                },
                current : {
                    ...(trackResult2 as any).current,
                    updatedAt : undefined,
                }
            },
            {
                changed : true,
                previous : {
                    isDefault : false,
                    row : {
                        appId : BigInt(1),
                        businessEnabledId : BigInt(1),
                        businessId : BigInt(2),
                        enabled : false,
                        updatedAt : undefined,
                        updatedByExternalUserId : "test",
                    },
                },
                current : {
                    appId : BigInt(1),
                    businessEnabledId : BigInt(2),
                    businessId : BigInt(2),
                    enabled : true,
                    updatedAt : undefined,
                    updatedByExternalUserId : "test2",
                },
            }
        );
    });

    await pool.disconnect();t.end();
});

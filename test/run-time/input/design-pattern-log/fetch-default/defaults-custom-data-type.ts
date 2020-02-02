import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {dtPoint} from "../../dt-point";

export const business = tsql.table("business")
    .addColumns({
        appId : dtPoint,
        businessId : tm.mysql.bigIntSigned(),
    })
    .setAutoIncrement(c => c.businessId)
    .removeAllMutable();

export const businessEnabled = tsql.table("businessEnabled")
    .addColumns({
        appId : dtPoint,
        businessEnabledId : tm.mysql.bigIntSigned(),
        businessId : tm.mysql.bigIntSigned(),
        enabled : dtPoint,
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
        return business.whereEqPrimaryKey(ownerPrimaryKey).fetchOne(connection, c => [c.appId]);
    })
    .setTrackedDefaults({
        enabled : {
            x : 1,
            y : 2,
        },
    });

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE business (
                appId TEXT NOT NULL,
                businessId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
            );

            CREATE TABLE businessEnabled (
                appId TEXT NOT NULL,
                businessEnabledId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                businessId INTEGER NOT NULL,
                enabled TEXT NOT NULL,
                updatedAt DATETIME NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
                updatedByExternalUserId VARCHAR(255) NOT NULL,
                FOREIGN KEY (appId, businessId) REFERENCES business (appId, businessId),
                CONSTRAINT updateRateConstraint UNIQUE (businessId, updatedAt)
            );

            INSERT INTO business(appId) VALUES
                ('{"x":1,"y":1}'),
                ('{"x":1,"y":1}'),
                ('{"x":2,"y":2}'),
                ('{"x":3,"y":3}');
        `);

        const validationResult = await tsql.SchemaValidationUtil.validateSchema(
            [business, businessEnabled],
            //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
            .fetchDefault(
                connection,
                { businessId : BigInt(2) }
            )
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        appId : {
                            x : 1,
                            y : 1,
                        },
                        businessId : BigInt(2),
                        enabled : {
                            x : 1,
                            y : 2,
                        },
                    }
                );
            });
        await businessEnabledLog
            .fetchDefault(
                connection,
                { businessId : BigInt(3) }
            )
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        appId : {
                            x : 2,
                            y : 2,
                        },
                        businessId : BigInt(3),
                        enabled : {
                            x : 1,
                            y : 2,
                        },
                    }
                );
            });
        await businessEnabledLog
            .fetchDefault(
                connection,
                { businessId : BigInt(4) }
            )
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        appId : {
                            x : 3,
                            y : 3,
                        },
                        businessId : BigInt(4),
                        enabled : {
                            x : 1,
                            y : 2,
                        },
                    }
                );
            });
    });

    await pool.disconnect();
    t.end();
});

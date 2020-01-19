import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE myTable (
                myTableId INT PRIMARY KEY,
                createdAt DATETIME(3)
            );
            INSERT INTO
                myTable(myTableId, createdAt)
            VALUES
                (1, '2015-01-01 00:00:00.000'),
                (2, '2015-01-02 00:00:00.000'),
                (3, '2015-01-03 00:00:00.000');
        `);

        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntSigned(),
                createdAt : tm.mysql.dateTime(3),
            })
            .setPrimaryKey(columns => [columns.myTableId]);

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [columns]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : BigInt(1),
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
                }
            )
            .fetchOne(
                connection,
                columns => [columns]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : BigInt(1),
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                    createdAt : new Date("2015-01-01T00:00:00.001Z"),
                }
            )
            .fetchOne(
                connection,
                columns => [columns]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    undefined
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });

        await myTable
            .whereEqSuperKey(
                {
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
                } as any
            )
            .fetchOne(
                connection,
                columns => [columns]
            )
            .orUndefined()
            .then(() => {
                t.fail("Should not execute");
            })
            .catch((err) => {
                t.false(err instanceof tsql.RowNotFoundError);
                t.false(err instanceof tsql.TooManyRowsFoundError);
            });

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [columns.myTableId]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : BigInt(1),
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [columns.createdAt]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [columns.createdAt, columns.myTableId]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : BigInt(1),
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("dayAfterCreation")
                ]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : BigInt(1),
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                        dayAfterCreation : new Date("2015-01-02T00:00:00.000Z"),
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await connection.exec(`DELETE FROM myTable`);

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [columns]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    undefined
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [columns.myTableId]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    undefined
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [columns.createdAt]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    undefined
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [columns.createdAt, columns.myTableId]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    undefined
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });

        await myTable
            .whereEqSuperKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("dayAfterCreation")
                ]
            )
            .orUndefined()
            .then((row) => {
                t.deepEqual(
                    row,
                    undefined
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });

    });

    await pool.disconnect();
    t.end();
});

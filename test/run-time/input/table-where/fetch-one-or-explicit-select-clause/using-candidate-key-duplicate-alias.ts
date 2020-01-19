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
                createdAt : tm.mysql.dateTime(),
            })
            .setPrimaryKey(columns => [columns.myTableId]);

        await myTable
            .whereEqCandidateKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("createdAt")
                ]
            )
            .or(1337)
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTable : {
                            myTableId : BigInt(1),
                            createdAt : new Date("2015-01-01T00:00:00.000Z"),
                        },
                        $aliased : {
                            createdAt : new Date("2015-01-02T00:00:00.000Z"),
                        }
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await myTable
            .whereEqCandidateKey(
                {
                    myTableId : BigInt(1),
                    /**
                     * This should get ignored as it is not part of the candidate key.
                     */
                    createdAt : new Date(),
                } as any
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("createdAt")
                ]
            )
            .or(1337)
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTable : {
                            myTableId : BigInt(1),
                            createdAt : new Date("2015-01-01T00:00:00.000Z"),
                        },
                        $aliased : {
                            createdAt : new Date("2015-01-02T00:00:00.000Z"),
                        }
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await myTable
            .whereEqCandidateKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("myTableId")
                ]
            )
            .or(1337)
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTable : {
                            myTableId : BigInt(1),
                            createdAt : new Date("2015-01-01T00:00:00.000Z"),
                        },
                        $aliased : {
                            myTableId : new Date("2015-01-02T00:00:00.000Z"),
                        }
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await myTable
            .whereEqCandidateKey(
                {
                    myTableId : BigInt(1),
                    /**
                     * This should get ignored as it is not part of the candidate key.
                     */
                    createdAt : new Date(),
                } as any
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("myTableId")
                ]
            )
            .or(1337)
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTable : {
                            myTableId : BigInt(1),
                            createdAt : new Date("2015-01-01T00:00:00.000Z"),
                        },
                        $aliased : {
                            myTableId : new Date("2015-01-02T00:00:00.000Z"),
                        }
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await myTable
            .whereEqCandidateKey(
                {
                    myTableId : BigInt(100),
                }
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("createdAt")
                ]
            )
            .or(1337)
            .then((row) => {
                t.deepEqual(
                    row,
                    1337
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });

        await connection.exec(`DELETE FROM myTable`);

        await myTable
            .whereEqCandidateKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("createdAt")
                ]
            )
            .or(1337)
            .then((row) => {
                t.deepEqual(
                    row,
                    1337
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });

        await myTable
            .whereEqCandidateKey(
                {
                    myTableId : BigInt(1),
                    /**
                     * This should get ignored as it is not part of the candidate key.
                     */
                    createdAt : new Date(),
                } as any
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("createdAt")
                ]
            )
            .or(1337)
            .then((row) => {
                t.deepEqual(
                    row,
                    1337
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });

        await myTable
            .whereEqCandidateKey(
                {
                    myTableId : BigInt(1),
                }
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("myTableId")
                ]
            )
            .or(1337)
            .then((row) => {
                t.deepEqual(
                    row,
                    1337
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });

        await myTable
            .whereEqCandidateKey(
                {
                    myTableId : BigInt(1),
                    /**
                     * This should get ignored as it is not part of the candidate key.
                     */
                    createdAt : new Date(),
                } as any
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("myTableId")
                ]
            )
            .or(1337)
            .then((row) => {
                t.deepEqual(
                    row,
                    1337
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });

        await myTable
            .whereEqCandidateKey(
                {
                    myTableId : BigInt(100),
                }
            )
            .fetchOne(
                connection,
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("createdAt")
                ]
            )
            .or(1337)
            .then((row) => {
                t.deepEqual(
                    row,
                    1337
                );
            })
            .catch(() => {
                t.fail("Should fetch default value");
            });


    });

    await pool.disconnect();
    t.end();
});

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
            .usingSuperKey(
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
            .usingSuperKey(
                {
                    myTableId : BigInt(1),
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
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
            .usingSuperKey(
                {
                    myTableId : BigInt(1),
                    createdAt : new Date("2015-01-01T00:00:00.001Z"),
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
            .then(() => {
                t.fail("Should not exist");
            })
            .catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });

        await myTable
            .usingSuperKey(
                {
                    createdAt : new Date("2015-01-01T00:00:00.001Z"),
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
            .then(() => {
                t.fail("Should not execute");
            })
            .catch((err) => {
                t.false(err instanceof tsql.RowNotFoundError);
                t.false(err instanceof tsql.TooManyRowsFoundError);
            });

        await myTable
            .usingSuperKey(
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
            .usingSuperKey(
                {
                    myTableId : BigInt(1),
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
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
            .usingSuperKey(
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
            .then(() => {
                t.fail("Should not exist");
            })
            .catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });

        await connection.exec(`DELETE FROM myTable`);

        await myTable
            .usingSuperKey(
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
            .then(() => {
                t.fail("Should not exist");
            })
            .catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });

        await myTable
            .usingSuperKey(
                {
                    myTableId : BigInt(1),
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
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
            .then(() => {
                t.fail("Should not exist");
            })
            .catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });

        await myTable
            .usingSuperKey(
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
            .then(() => {
                t.fail("Should not exist");
            })
            .catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });

        await myTable
            .usingSuperKey(
                {
                    myTableId : BigInt(1),
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
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
            .then(() => {
                t.fail("Should not exist");
            })
            .catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });

        await myTable
            .usingSuperKey(
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
            .then(() => {
                t.fail("Should not exist");
            })
            .catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });


    });

    t.end();
});

import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {dtPoint} from "../../dt-point";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE myTable (
                myTableId TEXT PRIMARY KEY,
                createdAt DATETIME(3)
            );
            INSERT INTO
                myTable(myTableId, createdAt)
            VALUES
                ('{"x":1,"y":2}', '2015-01-01 00:00:00.000'),
                ('{"x":2,"y":2}', '2015-01-02 00:00:00.000'),
                ('{"x":3,"y":2}', '2015-01-03 00:00:00.000');
        `);

        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : dtPoint,
                createdAt : tm.mysql.dateTime(),
            })
            .setPrimaryKey(columns => [columns.myTableId]);

        await myTable
            .whereEqPrimaryKey(
                {
                    myTableId : {
                        x : 1,
                        y : 2,
                    },
                }
            )
            .fetchOne(connection)
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : {
                            x : 1,
                            y : 2,
                        },
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await myTable
            .whereEqPrimaryKey(
                {
                    myTableId : {
                        x : 1,
                        y : 2,
                    },
                    /**
                     * This should get ignored as it is not part of the primary key.
                     */
                    createdAt : new Date(),
                } as any
            )
            .fetchOne(connection)
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : {
                            x : 1,
                            y : 2,
                        },
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await myTable
            .whereEqPrimaryKey(
                {
                    myTableId : {
                        x : 100,
                        y : 2,
                    },
                }
            )
            .fetchOne(connection)
            .then(() => {
                t.fail("Should not exist");
            })
            .catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });

        await myTable
            .whereEqPrimaryKey(
                {
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
                } as any
            )
            .fetchOne(connection)
            .then(() => {
                t.fail("Should not execute");
            })
            .catch((err) => {
                t.false(err instanceof tsql.RowNotFoundError);
                t.false(err instanceof tsql.TooManyRowsFoundError);
            });

        await connection.exec(`DELETE FROM myTable`);

        await myTable
            .whereEqPrimaryKey(
                {
                    myTableId : {
                        x : 1,
                        y : 2,
                    },
                }
            )
            .fetchOne(connection)
            .then(() => {
                t.fail("Should not exist");
            })
            .catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });

        await myTable
            .whereEqPrimaryKey(
                {
                    myTableId : {
                        x : 1,
                        y : 2,
                    },
                    /**
                     * This should get ignored as it is not part of the primary key.
                     */
                    createdAt : new Date(),
                } as any
            )
            .fetchOne(connection)
            .then(() => {
                t.fail("Should not exist");
            })
            .catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });

        await myTable
            .whereEqPrimaryKey(
                {
                    myTableId : {
                        x : 100,
                        y : 2,
                    },
                }
            )
            .fetchOne(connection)
            .then(() => {
                t.fail("Should not exist");
            })
            .catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });

        await myTable
            .whereEqPrimaryKey(
                {
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
                } as any
            )
            .fetchOne(connection)
            .then(() => {
                t.fail("Should not execute");
            })
            .catch((err) => {
                t.false(err instanceof tsql.RowNotFoundError);
                t.false(err instanceof tsql.TooManyRowsFoundError);
            });

    });

    await pool.disconnect();
    t.end();
});

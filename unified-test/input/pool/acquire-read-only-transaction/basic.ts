import * as tm from "type-mapping";
import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                value : tsql.dtBigIntSigned(),
            })
            .setId(columns => columns.value);

        await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "myTable",
                            columns : [
                                {
                                    columnAlias : "value",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                }
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "value",
                                autoIncrement : false,
                            } as const,
                        }
                    ]
                }
            );

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : BigInt(9001),
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : BigInt(9001) });
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : BigInt("9223372036854775807"),
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : BigInt("9223372036854775807") });
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : BigInt("-9223372036854775808"),
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : BigInt("-9223372036854775808") });
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : BigInt("-9223372036854775809"),
                    }
                )
                .then(() => {
                    t.fail("Should be out of range");
                })
                .catch((err) => {
                    t.deepEqual(tm.ErrorUtil.isMappingError(err), true);
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : BigInt("9223372036854775808"),
                    }
                )
                .then(() => {
                    t.fail("Should be out of range");
                })
                .catch((err) => {
                    t.deepEqual(tm.ErrorUtil.isMappingError(err), true);
                });
        });

        await pool.acquireReadOnlyTransaction(async (connection) => {
            t.deepEqual(connection.getMinimumIsolationLevel(), tsql.IsolationLevel.SERIALIZABLE);
            t.deepEqual(connection.getTransactionAccessMode(), tsql.TransactionAccessMode.READ_ONLY);

            await tsql.from(myTable)
                .orderBy(columns => [
                    columns.value.asc(),
                ])
                .select(columns => [
                    columns.value,
                ])
                .fetchValueArray(connection)
                .then((arr) => {
                    t.deepEqual(
                        arr,
                        [
                            BigInt("-9223372036854775808"),
                            BigInt(9001),
                            BigInt("9223372036854775807"),
                        ]
                    );
                });
        });

        t.end();
    });
};

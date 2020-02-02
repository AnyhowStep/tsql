import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const myTable = tsql.table("myTable")
                .addColumns({
                    value0 : tsql.dtBigIntSigned(),
                    value1 : tsql.dtBigIntSigned(),
                    value2 : tsql.dtBigIntSigned(),
                });

            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "myTable",
                            columns : [
                                {
                                    columnAlias : "value0",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "value1",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "value2",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                        }
                    ]
                }
            );

            await myTable
                .insertMany(
                    connection,
                    [
                        {
                            value0 : BigInt(0),
                            value1 : BigInt(0),
                            value2 : BigInt(0),
                        },
                        {
                            value0 : BigInt(0),
                            value1 : BigInt(0),
                            value2 : BigInt(1),
                        },
                        {
                            value0 : BigInt(0),
                            value1 : BigInt(1),
                            value2 : BigInt(0),
                        },
                        {
                            value0 : BigInt(0),
                            value1 : BigInt(1),
                            value2 : BigInt(1),
                        },
                        {
                            value0 : BigInt(1),
                            value1 : BigInt(0),
                            value2 : BigInt(0),
                        },
                        {
                            value0 : BigInt(1),
                            value1 : BigInt(0),
                            value2 : BigInt(1),
                        },
                        {
                            value0 : BigInt(1),
                            value1 : BigInt(1),
                            value2 : BigInt(0),
                        },
                        {
                            value0 : BigInt(1),
                            value1 : BigInt(1),
                            value2 : BigInt(1),
                        },
                    ]
                );

            await myTable
                .where(columns => tsql.eq(
                    columns.value0,
                    BigInt(1)
                ))
                .where(columns => tsql.eq(
                    columns.value1,
                    BigInt(0)
                ))
                .where(columns => tsql.eq(
                    columns.value2,
                    BigInt(0)
                ))
                .fetchOne(connection)
                .then((row) => {
                    t.deepEqual(
                        row,
                        {
                            value0 : BigInt(1),
                            value1 : BigInt(0),
                            value2 : BigInt(0),
                        }
                    );
                });

            await myTable
                /**
                 * An impossible condition
                 */
                .where(columns => tsql.eq(
                    columns.value0,
                    BigInt(1)
                ))
                .where(columns => tsql.eq(
                    columns.value0,
                    BigInt(0)
                ))
                .fetchOne(connection)
                .orUndefined()
                .then((row) => {
                    t.deepEqual(
                        row,
                        undefined
                    );
                });
        });

        t.end();
    });
};

import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const myTable = tsql.table("myTable")
                .addColumns({
                    value : tsql.dtDecimal(65, 30),
                })
                .setId(columns => columns.value);

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
                                        typeHint : tsql.TypeHint.DECIMAL,
                                        precision : 65,
                                        scale : 30,
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
                        value : tsql.decimalLiteral(1.23, 3, 2),
                    }
                )
                .then((row) => {
                    t.deepEqual(row.value.toString(), "1.23");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : tsql.decimalLiteral("1234567890123.456789012345678901234567890888", 43, 30),
                    }
                )
                .then((row) => {
                    t.deepEqual(row.value.toString(), "1234567890123.456789012345678901234567890888");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : tsql.decimalLiteral("-1234567890123.456789012345678901234567890888", 43, 30),
                    }
                )
                .then((row) => {
                    t.deepEqual(row.value.toString(), "-1234567890123.456789012345678901234567890888");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

        });

        t.end();
    });
};

import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
tape(__filename, async (t) => {
    const dst = tsql.table("dst")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId])
        .addMutable(columns => [
            columns.testVal,
        ]);

    await pool.acquire(async (connection) => {
        await createTemporarySchema(
            connection,
            {
                tables : [
                    {
                        tableAlias : "dst",
                        columns : [
                            {
                                columnAlias : "testId",
                                dataType : {
                                    typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                },
                            },
                            {
                                columnAlias : "testVal",
                                dataType : {
                                    typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                },
                            },
                        ],
                        /**
                         * We don't actually have a primary key,
                         * even though we say we do.
                         *
                         * We are lying to try and trick the library
                         * into updating more than one row,
                         * which should not happen.
                         */
                    }
                ]
            }
        );

        await dst
            .enableExplicitAutoIncrementValue()
            .insertMany(
                connection,
                [
                    {
                        testId : BigInt(1),
                        testVal : BigInt(100),
                    },
                    {
                        testId : BigInt(1),
                        testVal : BigInt(100),
                    },
                    {
                        testId : BigInt(2),
                        testVal : BigInt(200),
                    },
                    {
                        testId : BigInt(3),
                        testVal : BigInt(300),
                    },
                ]
            );

        return dst.updateOneBySuperKey(
            connection,
            {
                testId : BigInt(1),
                testVal : BigInt(100),
            },
            columns => {
                return {
                    testVal : tsql.integer.add(
                        columns.testVal,
                        BigInt(50)
                    ),
                };
            }
        ).then(() => {
            t.fail("Should not update anything");
        }).catch((err) => {
            t.true(err instanceof tsql.TooManyRowsFoundError);
        });
    });

    await pool
        .acquire(async (connection) => {
            return tsql.from(dst)
                .select(columns => [columns])
                .orderBy(columns => [
                    columns.testId.asc(),
                ])
                .fetchAll(connection);
        })
        .then((rows) => {
            t.deepEqual(
                rows,
                [
                    {
                        testId : BigInt(1),
                        testVal : BigInt(100),
                    },
                    {
                        testId : BigInt(1),
                        testVal : BigInt(100),
                    },
                    {
                        testId : BigInt(2),
                        testVal : BigInt(200),
                    },
                    {
                        testId : BigInt(3),
                        testVal : BigInt(300),
                    },
                ]
            );
        });

    t.end();
});
};

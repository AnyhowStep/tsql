import * as tm from "type-mapping";
import {
    Sqlfier,
    OperatorType,
    AstUtil,
    functionCall,
    escapeIdentifierWithDoubleQuotes,
    notImplementedSqlfier,
    SelectClause,
    Ast,
    ColumnUtil,
    SEPARATOR,
    FromClauseUtil,
    JoinType,
    isIdentifierNode,
    ExprSelectItemUtil,
    WhereClause,
    ColumnMapUtil,
    IColumn,
    ColumnMap,
    ColumnRefUtil,
    ColumnRef,
    OrderByClause,
    ExprUtil,
    HavingClause,
    GroupByClause,
    LimitClause,
    escapeValue,
    ALIASED,
    CompoundQueryClause,
    IQueryBase,
    QueryBaseUtil,
    DateTimeUtil,
    utcStringToTimestamp,
    TypeHint,
    pascalStyleEscapeString,
    parentheses,
    Parentheses,
    OperatorNodeUtil,
    DataOutOfRangeError,
} from "../dist";
import {LiteralValueType, LiteralValueNodeUtil} from "../dist/ast/literal-value-node";

/**
* We do not use `ABS(-9223372036854775808)` because of,
* https://github.com/AnyhowStep/tsql/issues/233
*/
export const THROW_AST = "(SELECT SUM(9223372036854775807) FROM (SELECT NULL UNION ALL SELECT NULL))";

const insertBetween = AstUtil.insertBetween;

function normalizeOrderByAndLimitClauses (query : IQueryBase) : IQueryBase {
    /**
     * MySQL behaviour,
     * No `UNION` clause.
     *
     * | `ORDER BY` | `LIMIT` | `UNION ORDER BY` | `UNION LIMIT` | Result
     * |------------|---------|------------------|---------------|-------------------------------------------------
     * | Y          | Y       | Y                | Y             | `ORDER BY ... LIMIT ...) ORDER BY ... LIMIT ...`
     * | Y          | Y       | Y                | N             | `ORDER BY ... LIMIT ...) ORDER BY ...`
     * | Y          | Y       | N                | Y             | `ORDER BY ...) LIMIT ...`
     * | Y          | Y       | N                | N             | `ORDER BY ... LIMIT ...)`
     * | Y          | N       | Y                | Y             | `) ORDER BY ... LIMIT ...`
     * | Y          | N       | Y                | N             | `) ORDER BY ...`
     * | Y          | N       | N                | Y             | `ORDER BY ...) LIMIT ...`
     * | Y          | N       | N                | N             | `ORDER BY ...)`
     * |------------|---------|------------------|---------------|-------------------------------------------------
     * | N          | Y       | Y                | Y             | `LIMIT ...) ORDER BY ... LIMIT ...`
     * | N          | Y       | Y                | N             | `LIMIT ...) ORDER BY ...`
     * | N          | Y       | N                | Y             | `) LIMIT ...`
     * | N          | Y       | N                | N             | `LIMIT ...)`
     * | N          | N       | Y                | Y             | `) ORDER BY ... LIMIT ...`
     * | N          | N       | Y                | N             | `) ORDER BY ...`
     * | N          | N       | N                | Y             | `) LIMIT ...`
     * | N          | N       | N                | N             | `)`
     *
     * Observations:
     * + With no `LIMIT` clause, the `UNION ORDER BY` and `UNION LIMIT` take over, regardless of `ORDER BY`
     * + With the `LIMIT` clause, the `UNION ORDER BY` never takes over
     * + With the `LIMIT` clause, the `UNION LIMIT` takes over when there is no `UNION ORDER BY`
     *
     * + `UNION LIMIT` takes over when, !`LIMIT` || !`UNION ORDER BY`
     * + `UNION ORDER BY` takes over when, !`LIMIT`
     */
    /**
     *
     * MySQL behaviour,
     * With `UNION` clause.
     *
     * Nothing is taken over.
     */

    const orderByClause = (
        (
            query.compoundQueryOrderByClause != undefined &&
            query.compoundQueryClause == undefined &&
            query.limitClause == undefined
        ) ?
        query.compoundQueryOrderByClause :
        query.orderByClause
    );
    const limitClause = (
        (
            query.compoundQueryLimitClause != undefined &&
            query.compoundQueryClause == undefined &&
            (
                query.limitClause == undefined ||
                query.compoundQueryOrderByClause == undefined
            )
        ) ?
        query.compoundQueryLimitClause :
        query.limitClause
    );

    const compoundQueryOrderByClause = (
        orderByClause == query.compoundQueryOrderByClause ?
        undefined :
        query.compoundQueryOrderByClause
    );
    const compoundQueryLimitClause = (
        limitClause == query.compoundQueryLimitClause ?
        undefined :
        query.compoundQueryLimitClause
    );

    return {
        ...query,
        orderByClause,
        limitClause,
        compoundQueryOrderByClause,
        compoundQueryLimitClause,
    };
}

function selectClauseColumnToSql (column : IColumn, isDerivedTable : boolean) : string[] {
    return [
        [
            escapeIdentifierWithDoubleQuotes(column.tableAlias),
            ".",
            escapeIdentifierWithDoubleQuotes(column.columnAlias)
        ].join(""),
        "AS",
        escapeIdentifierWithDoubleQuotes(
            isDerivedTable ?
            column.columnAlias :
            `${column.tableAlias}${SEPARATOR}${column.columnAlias}`
        )
    ];
}
function selectClauseColumnArrayToSql (columns : IColumn[], isDerivedTable : boolean) : string[] {
    columns.sort((a, b) => {
        const tableAliasCmp = a.tableAlias.localeCompare(b.tableAlias);
        if (tableAliasCmp != 0) {
            return tableAliasCmp;
        }
        return a.columnAlias.localeCompare(b.columnAlias);
    });
    const result : string[] = [];
    for (const column of columns) {
        if (result.length > 0) {
            result.push(",");
        }
        result.push(
            ...selectClauseColumnToSql(column, isDerivedTable)
        );
    }
    return result;
}
function selectClauseColumnMapToSql (map : ColumnMap, isDerivedTable : boolean) : string[] {
    const columns = ColumnUtil.fromColumnMap(map);
    return selectClauseColumnArrayToSql(columns, isDerivedTable);
}
function selectClauseColumnRefToSql (ref : ColumnRef, isDerivedTable : boolean) : string[] {
    const columns = ColumnUtil.fromColumnRef(ref);
    return selectClauseColumnArrayToSql(columns, isDerivedTable);
}
function selectClauseToSql (
    selectClause : SelectClause,
    toSql : (ast : Ast) => string,
    isDerivedTable : boolean,
    isDistinct : boolean
) : string[] {
    const result : string[] = [];
    for (const selectItem of selectClause) {
        if (result.length > 0) {
            result.push(",");
        }
        if (ColumnUtil.isColumn(selectItem)) {
            result.push(
                ...selectClauseColumnToSql(selectItem, isDerivedTable)
            );
        } else if (ExprSelectItemUtil.isExprSelectItem(selectItem)) {
            result.push(
                toSql(selectItem.unaliasedAst),
                "AS",
                escapeIdentifierWithDoubleQuotes(
                    isDerivedTable ?
                    selectItem.alias :
                    `${selectItem.tableAlias}${SEPARATOR}${selectItem.alias}`
                )
            );
        } else if (ColumnMapUtil.isColumnMap(selectItem)) {
            result.push(...selectClauseColumnMapToSql(selectItem, isDerivedTable));
        } else if (ColumnRefUtil.isColumnRef(selectItem)) {
            result.push(...selectClauseColumnRefToSql(selectItem, isDerivedTable));
        } else {
            throw new Error(`Not implemented`);
        }
    }
    return isDistinct ?
        ["SELECT DISTINCT", ...result] :
        ["SELECT", ...result];
}

function fromClauseToSql (
    currentJoins : FromClauseUtil.AfterFromClause["currentJoins"],
    toSql : (ast : Ast) => string
) : string[] {
    const result : string[] = [];
    for (const join of currentJoins) {
        if (join.joinType == JoinType.FROM) {
            result.push("FROM");
        } else {
            result.push(join.joinType, "JOIN");
        }
        if (isIdentifierNode(join.tableAst)) {
            const lastIdentifier = join.tableAst.identifiers[join.tableAst.identifiers.length-1];
            if (lastIdentifier == join.tableAlias) {
                result.push(toSql(join.tableAst));
            } else {
                result.push(
                    toSql(join.tableAst),
                    "AS",
                    escapeIdentifierWithDoubleQuotes(join.tableAlias)
                );
            }
        } else if (QueryBaseUtil.isQuery(join.tableAst)) {
            result.push("(", queryToSql(join.tableAst, toSql, true), ")");
            result.push("AS");
            result.push(escapeIdentifierWithDoubleQuotes(join.tableAlias));
        } else if (Parentheses.IsParentheses(join.tableAst) && QueryBaseUtil.isQuery(join.tableAst.ast)) {
            const subQuery = join.tableAst.ast;

            result.push("(", queryToSql(subQuery, toSql, true), ")");
            result.push("AS");
            result.push(escapeIdentifierWithDoubleQuotes(join.tableAlias));
        } else {
            result.push("(", toSql(join.tableAst), ")");
            result.push("AS");
            result.push(escapeIdentifierWithDoubleQuotes(join.tableAlias));
        }
        if (join.onClause != undefined) {
            result.push("ON");
            result.push(toSql(AstUtil.tryUnwrapParentheses(join.onClause.ast)));
        }
    }
    return result;
}

function whereClauseToSql (whereClause : WhereClause, toSql : (ast : Ast) => string) : string[] {
    return [
        "WHERE",
        toSql(AstUtil.tryUnwrapParentheses(whereClause.ast))
    ];
}

function orderByClauseToSql (orderByClause : OrderByClause, toSql : (ast : Ast) => string) : string[] {
    if (orderByClause.length == 0) {
        return [];
    }
    const result : string[] = [];
    for (const [sortExpr, sortDirection] of orderByClause) {
        if (result.length > 0) {
            result.push(",");
        }
        if (ColumnUtil.isColumn(sortExpr)) {
            if (sortExpr.unaliasedAst == undefined) {
                result.push(
                    [
                        escapeIdentifierWithDoubleQuotes(sortExpr.tableAlias),
                        ".",
                        escapeIdentifierWithDoubleQuotes(sortExpr.columnAlias)
                    ].join("")
                );
            } else {
                result.push(
                    escapeIdentifierWithDoubleQuotes(
                        `${sortExpr.tableAlias}${SEPARATOR}${sortExpr.columnAlias}`
                    )
                );
            }
        } else if (ExprUtil.isExpr(sortExpr)) {
            if (LiteralValueNodeUtil.isLiteralValueNode(sortExpr.ast)) {
                if (sortExpr.ast.literalValueType == LiteralValueType.BIGINT_SIGNED) {
                    result.push(toSql([sortExpr.ast, "+ 0"]));
                } else {
                    result.push(toSql(sortExpr.ast));
                }
            } else {
                result.push(toSql(sortExpr.ast));
            }
        } else {
            result.push(toSql(sortExpr.unaliasedAst));
        }
        result.push(sortDirection);
    }
    return [
        "ORDER BY",
        ...result
    ];
}

function groupByClauseToSql (groupByClause : GroupByClause, _toSql : (ast : Ast) => string) : string[] {
    if (groupByClause.length == 0) {
        return [];
    }

    const result : string[] = [];
    for (const column of groupByClause) {
        if (result.length > 0) {
            result.push(",");
        }
        if (column.tableAlias == ALIASED) {
            result.push(
                escapeIdentifierWithDoubleQuotes(
                    `${column.tableAlias}${SEPARATOR}${column.columnAlias}`
                )
            );
        } else {
            result.push(
                [
                    escapeIdentifierWithDoubleQuotes(column.tableAlias),
                    ".",
                    escapeIdentifierWithDoubleQuotes(column.columnAlias)
                ].join("")
            );
        }
    }

    return [
        "GROUP BY",
        ...result
    ];
}

function havingClauseToSql (havingClause : HavingClause, toSql : (ast : Ast) => string) : string[] {
    return [
        "HAVING",
        toSql(AstUtil.tryUnwrapParentheses(havingClause.ast))
    ];
}

function limitClauseToSql (limitClause : LimitClause, _toSql : (ast : Ast) => string) : string[] {
    return [
        "LIMIT",
        escapeValue(limitClause.maxRowCount),
        "OFFSET",
        escapeValue(limitClause.offset),
    ];
}

function compoundQueryClauseToSql (compoundQueryClause : CompoundQueryClause, toSql : (ast : Ast) => string) : string[] {
    const result : string[] = [];
    for (const rawCompoundQuery of compoundQueryClause) {
        result.push(rawCompoundQuery.compoundQueryType);
        if (!rawCompoundQuery.isDistinct) {
            result.push("ALL");
        }

        const query = rawCompoundQuery.query;
        if (
            query.orderByClause != undefined ||
            query.limitClause != undefined ||
            query.compoundQueryClause != undefined ||
            query.compoundQueryOrderByClause != undefined ||
            query.compoundQueryLimitClause != undefined
        ) {
            result.push(
                "SELECT * FROM (",
                toSql(query),
                ")"
            );
        } else {
            result.push(toSql(query));
        }
    }
    return result;
}

function queryToSql (
    rawQuery : IQueryBase,
    toSql : (ast : Ast) => string,
    isDerivedTable : boolean
) {
    const query = normalizeOrderByAndLimitClauses(rawQuery);

    if (
        (
            /**
             * If we have both a compound `ORDER BY/LIMIT` clause
             * and regular `ORDER BY/LIMIT` clause,
             * we will need a derived table because
             * SQLite only supports on `ORDER BY` and `LIMIT` clause for the entire query.
             */
            (
                query.compoundQueryOrderByClause != undefined ||
                query.compoundQueryLimitClause != undefined
            ) &&
            (
                query.orderByClause != undefined ||
                query.limitClause != undefined
            )
        ) ||
        /**
         * If we have a compound query and an `ORDER BY` or `LIMIT` clause,
         * we will need to make the query a derived table because
         * SQLite only supports on `ORDER BY` and `LIMIT` clause for the entire query.
         */
        (
            query.compoundQueryClause != undefined &&
            (
                query.orderByClause != undefined ||
                query.limitClause != undefined
            )
        )
    ) {
        /**
         * We have to apply some hackery to get the same behaviour as MySQL.
         */
        const innerQuery = {
            ...query,
            compoundQueryClause : undefined,
            compoundQueryOrderByClause : undefined,
            compoundQueryLimitClause : undefined,
        };
        const result : string[] = [
            "SELECT * FROM (",
            toSql(innerQuery),
            ")"
        ];

        if (query.compoundQueryClause != undefined) {
            result.push(compoundQueryClauseToSql(query.compoundQueryClause, toSql).join(" "));
        }

        if (query.compoundQueryOrderByClause != undefined) {
            result.push(orderByClauseToSql(query.compoundQueryOrderByClause, toSql).join(" "));
        }

        if (query.compoundQueryLimitClause != undefined) {
            result.push(limitClauseToSql(query.compoundQueryLimitClause, toSql).join(" "));
        }

        return result.join(" ");
    }

    const result : string[] = [];
    if (query.selectClause != undefined) {
        result.push(selectClauseToSql(query.selectClause, toSql, isDerivedTable, query.isDistinct).join(" "));
    }
    if (query.fromClause != undefined && query.fromClause.currentJoins != undefined) {
        result.push(fromClauseToSql(query.fromClause.currentJoins, toSql).join(" "));
    }
    if (query.limitClause != undefined && tm.BigIntUtil.equal(query.limitClause.maxRowCount, 0)) {
        /**
         * ```sql
         *  CREATE TABLE "myTable" ("myColumn" INT PRIMARY KEY);
         *  INSERT INTO "myTable"("myColumn") VALUES (4);
         *  SELECT
         *      COALESCE(
         *          (
         *              SELECT
         *                  "myTable"."myColumn" AS "myTable--myColumn"
         *              FROM
         *                  "myTable"
         *              LIMIT
         *                  0
         *              OFFSET
         *                  0
         *          ),
         *          3
         *      );
         * ```
         * The above gives `4` on SQLite.
         * Gives `3` on MySQL and PostgreSQL.
         * SQLite is bugged.
         *
         * The fix is to use `WHERE FALSE` when `LIMIT 0` is detected.
         *
         * ```sql
         *  CREATE TABLE "myTable" ("myColumn" INT PRIMARY KEY);
         *  INSERT INTO "myTable"("myColumn") VALUES (4);
         *  SELECT
         *      COALESCE(
         *          (
         *              SELECT
         *                  "myTable"."myColumn" AS "myTable--myColumn"
         *              FROM
         *                  "myTable"
         *              WHERE
         *                  FALSE
         *              LIMIT
         *                  0
         *              OFFSET
         *                  0
         *          ),
         *          3
         *      );
         * ```
         */
        result.push("WHERE FALSE");
    } else {
        if (query.whereClause != undefined) {
            result.push(whereClauseToSql(query.whereClause, toSql).join(" "));
        }
    }
    if (query.groupByClause == undefined || query.groupByClause.length == 0) {
        if (query.havingClause != undefined) {
            /**
             * Workaround for `<empty grouping set>` not supported by SQLite
             */
            throw new Error(`SQLite does not support ... GROUP BY () HAVING ...`);
            //result.push(havingClauseToSql(query.havingClause, toSql).join(" "));
        }
    } else {
        result.push(groupByClauseToSql(query.groupByClause, toSql).join(" "));
        if (query.havingClause != undefined) {
            result.push(havingClauseToSql(query.havingClause, toSql).join(" "));
        }
    }

    if (query.orderByClause != undefined) {
        result.push(orderByClauseToSql(query.orderByClause, toSql).join(" "));
    }

    if (query.limitClause != undefined) {
        result.push(limitClauseToSql(query.limitClause, toSql).join(" "));
    }

    if (query.compoundQueryClause != undefined) {
        result.push(compoundQueryClauseToSql(query.compoundQueryClause, toSql).join(" "));
    }

    if (query.compoundQueryOrderByClause != undefined) {
        result.push(orderByClauseToSql(query.compoundQueryOrderByClause, toSql).join(" "));
    }

    if (query.compoundQueryLimitClause != undefined) {
        result.push(limitClauseToSql(query.compoundQueryLimitClause, toSql).join(" "));
    }

    return result.join(" ");
}

export const sqliteSqlfier : Sqlfier = {
    identifierSqlfier : (identifierNode) => identifierNode.identifiers
        .map(escapeIdentifierWithDoubleQuotes)
        .join("."),
    literalValueSqlfier : {
        [LiteralValueType.DECIMAL] : ({literalValue, precision, scale}) => functionCall(
            "decimal_ctor",
            [
                pascalStyleEscapeString(literalValue),
                escapeValue(precision),
                escapeValue(scale)
            ]
        )/*toSql(
            castAsDecimal(
                literalValue,
                precision,
                scale
            ).ast
        )*/,
        [LiteralValueType.STRING] : ({literalValue}) => {
            if (literalValue.includes('\0')) {
                throw new Error(`String literal may not contain null characters`);
            }
            return pascalStyleEscapeString(literalValue);
        },
        [LiteralValueType.DOUBLE] : ({literalValue}) => {
            if (isNaN(literalValue)) {
                throw new DataOutOfRangeError({
                    message : `Literal ${literalValue} not allowed`,
                    /**
                     * @todo Figure out how to get the entire SQL, then throw?
                     */
                    sql : undefined,
                });
            }
            if (literalValue == Infinity) {
                return "(1e999)";
            }
            if (literalValue == -Infinity) {
                return "(-1e999)";
            }
            return escapeValue(literalValue);
        },
        [LiteralValueType.BIGINT_SIGNED] : ({literalValue}) => escapeValue(literalValue),
        /**
         * @deprecated
         */
        //[LiteralValueType.BIGINT_UNSIGNED] : ({literalValue}) => escapeValue(literalValue),
        [LiteralValueType.BOOLEAN] : ({literalValue}) => escapeValue(literalValue),
        [LiteralValueType.BUFFER] : ({literalValue}) => escapeValue(literalValue),
        [LiteralValueType.NULL] : ({literalValue}) => escapeValue(literalValue),
        [LiteralValueType.DATE_TIME] : ({literalValue}, toSql) => toSql(
            utcStringToTimestamp(
                DateTimeUtil.toSqlUtc(literalValue, 3)
            ).ast
        ),
    },
    operatorSqlfier : {
        ...notImplementedSqlfier.operatorSqlfier,
        /*
            Comparison Functions and Operators
            https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html
        */
        [OperatorType.BETWEEN_AND] : ({operands}) => [
            operands[0],
            "BETWEEN",
            operands[1],
            "AND",
            operands[2]
        ],
        [OperatorType.NOT_BETWEEN_AND] : ({operands}) => [
            operands[0],
            "NOT BETWEEN",
            operands[1],
            "AND",
            operands[2]
        ],
        [OperatorType.COALESCE] : ({operatorType, operands}) => functionCall(operatorType, operands),
        [OperatorType.EQUAL] : ({operands}) => insertBetween(operands, "="),
        [OperatorType.NULL_SAFE_EQUAL] : ({operands}) => insertBetween(operands, "IS"),
        [OperatorType.NOT_NULL_SAFE_EQUAL] : ({operands}) => insertBetween(operands, "IS NOT"),
        [OperatorType.LESS_THAN] : ({operands}) => insertBetween(operands, "<"),
        [OperatorType.GREATER_THAN] : ({operands}) => insertBetween(operands, ">"),
        [OperatorType.LESS_THAN_OR_EQUAL] : ({operands}) => insertBetween(operands, "<="),
        [OperatorType.GREATER_THAN_OR_EQUAL] : ({operands}) => insertBetween(operands, ">="),
        [OperatorType.IN_ARRAY] : ({operands : [x, ...rest]}) => {
            return [
                x,
                functionCall("IN", [...rest])
            ];
        },
        [OperatorType.IN_QUERY] : ({operands : [x, y]}) => {
            /**
             * https://github.com/AnyhowStep/tsql/issues/198
             */
            return [
                x,
                functionCall("IN", [
                    Parentheses.IsParentheses(y) ?
                    y.ast :
                    y
                ])
            ];
        },
        [OperatorType.NOT_IN_ARRAY] : ({operands : [x, ...rest]}) => {
            return [
                x,
                functionCall("NOT IN", [...rest])
            ];
        },
        [OperatorType.NOT_IN_QUERY] : ({operands : [x, y]}) => {
            /**
             * https://github.com/AnyhowStep/tsql/issues/198
             */
            return [
                x,
                functionCall("NOT IN", [
                    Parentheses.IsParentheses(y) ?
                    y.ast :
                    y
                ])
            ];
        },
        [OperatorType.IS_NOT_NULL] : ({operands}) => [operands[0], "IS NOT NULL"],
        [OperatorType.IS_NULL] : ({operands}) => [operands[0], "IS NULL"],
        [OperatorType.IS_UNKNOWN] : ({operands}) => [operands[0], "IS NULL"],
        [OperatorType.IS_NOT_UNKNOWN] : ({operands}) => [operands[0], "IS NOT NULL"],
        [OperatorType.IS_TRUE] : ({operands}) => [operands[0], "IS TRUE"],
        [OperatorType.IS_NOT_TRUE] : ({operands}) => [operands[0], "IS NOT TRUE"],
        [OperatorType.IS_FALSE] : ({operands}) => [operands[0], "IS FALSE"],
        [OperatorType.IS_NOT_FALSE] : ({operands}) => [operands[0], "IS NOT FALSE"],
        [OperatorType.LIKE_ESCAPE] : ({operands : [expr, pattern, escapeChar]}) => {
            if (LiteralValueNodeUtil.isLiteralValueNode(escapeChar) && escapeChar.literalValue === "") {
                return [
                    expr, "LIKE", pattern
                ];
            } else {
                return [
                    expr, "LIKE", pattern, "ESCAPE", escapeChar
                ];
            }
        },
        [OperatorType.NOT_LIKE_ESCAPE] : ({operands : [expr, pattern, escapeChar]}) => {
            if (LiteralValueNodeUtil.isLiteralValueNode(escapeChar) && escapeChar.literalValue === "") {
                return [
                    expr, "NOT LIKE", pattern
                ];
            } else {
                return [
                    expr, "NOT LIKE", pattern, "ESCAPE", escapeChar
                ];
            }
        },
        [OperatorType.NOT_EQUAL] : ({operands}) => insertBetween(operands, "<>"),
        [OperatorType.LEAST] : ({operands}) => functionCall("MIN", operands),
        [OperatorType.GREATEST] : ({operands}) => functionCall("MAX", operands),

        /*
            Logical Operators
            https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html
        */
        [OperatorType.AND] : ({operands}) => insertBetween(operands, "AND"),
        [OperatorType.OR] : ({operands}) => insertBetween(operands, "OR"),
        [OperatorType.NOT] : ({operands}) => [
            "NOT",
            operands[0]
        ],
        [OperatorType.XOR] : ({operands}) => insertBetween(operands, "<>"),

        /*
            Control Flow Functions
            https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html
        */
        [OperatorType.IF] : ({operands : [a, b, c]}) => [
            "CASE WHEN",
            a,
            "THEN",
            b,
            "ELSE",
            c,
            "END"
        ],
        [OperatorType.IF_NULL] : ({operands}) => functionCall("IFNULL", operands),
        [OperatorType.NULL_IF_EQUAL] : ({operands}) => functionCall("NULLIF", operands),

        /*
            String Functions and Operators
            https://dev.mysql.com/doc/refman/8.0/en/string-functions.html
        */
        [OperatorType.ASCII] : ({operands}) => functionCall("ASCII", operands),
        [OperatorType.BIN] : ({operands}) => functionCall("BIN", operands),
        [OperatorType.BIT_LENGTH] : ({operands}) => (
            [
                functionCall(
                    "LENGTH",
                    [
                        functionCall("CAST", [[operands, "AS BLOB"]])
                    ]
                ),
                "* 8"
            ]
        ),
        [OperatorType.CHAR_LENGTH] : ({operands}) => functionCall("LENGTH", operands),
        [OperatorType.OCTET_LENGTH] : ({operands}) => functionCall(
            "LENGTH",
            [
                functionCall("CAST", [[operands, "AS BLOB"]])
            ]
        ),
        [OperatorType.CONCAT] : ({operands}) => insertBetween(operands, "||"),
        [OperatorType.NULL_SAFE_CONCAT] : ({operands}) => (
            insertBetween(
                operands.map(operand => functionCall("COALESCE", [operand, "''"])),
                "||"
            )
        ),
        [OperatorType.CONCAT_WS] : ({operands}) => functionCall("CONCAT_WS", operands),
        [OperatorType.FROM_BASE64] : ({operands}) => functionCall("FROM_BASE64", operands),
        [OperatorType.HEX] : ({operands}) => functionCall("HEX", operands),
        [OperatorType.IN_STR] : ({operands}) => functionCall("INSTR", operands),
        [OperatorType.LPAD] : ({operands}) => functionCall("LPAD", operands),
        [OperatorType.RPAD] : ({operands}) => functionCall("RPAD", operands),
        [OperatorType.LTRIM] : ({operands}) => functionCall("LTRIM", operands),
        [OperatorType.RTRIM] : ({operands}) => functionCall("RTRIM", operands),
        [OperatorType.TRIM] : ({operands}) => functionCall("TRIM", operands),
        [OperatorType.POSITION] : ({operands}) => functionCall("INSTR", [operands[1], operands[0]]),
        [OperatorType.REPEAT] : ({operands}) => functionCall("REPEAT", operands),
        [OperatorType.REPLACE] : ({operands}) => functionCall("REPLACE", operands),
        [OperatorType.REVERSE] : ({operands}) => functionCall("REVERSE", operands),
        [OperatorType.TO_BASE64] : ({operands}) => functionCall("TO_BASE64", operands),
        [OperatorType.UNHEX] : ({operands}) => functionCall("UNHEX", operands),
        [OperatorType.UPPER] : ({operands}) => functionCall("UPPER", operands),
        [OperatorType.LOWER] : ({operands}) => functionCall("LOWER", operands),

        /*
            Arithmetic Operators
            https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html
        */
        [OperatorType.FRACTIONAL_DIVISION] : ({operands}) => insertBetween(operands, "/"),
        [OperatorType.INTEGER_DIVISION] : ({operands, typeHint}) => {
            if (typeHint == TypeHint.DOUBLE) {
                return functionCall(
                    "CAST",
                    [
                        [
                            insertBetween(operands, "/"),
                            "AS BIGINT"
                        ]
                    ]
                );
            } else if (typeHint == TypeHint.BIGINT_SIGNED) {
                return functionCall("bigint_div", operands);
            } else {
                throw new Error(`INTEGER_DIVISION not implemented for ${typeHint}`);
            }
        },
        /**
         * In SQLite, `%` ONLY does integer remainder
         */
        [OperatorType.INTEGER_REMAINDER] : ({operands, typeHint}, toSql) => {
            if (typeHint == TypeHint.DOUBLE) {
                return functionCall(
                    "CAST",
                    [
                        toSql(
                            insertBetween(
                                operands.map(op => functionCall(
                                    "CAST",
                                    [
                                        toSql(op) + " AS INTEGER"
                                    ]
                                )),
                                "%"
                            )
                        ) + " AS DOUBLE"
                    ]
                );
            } else if (typeHint == TypeHint.BIGINT_SIGNED) {
                return insertBetween(operands, "%");
            } else {
                throw new Error(`INTEGER_REMAINDER not implemented for ${typeHint}`);
            }
        },
        [OperatorType.FRACTIONAL_REMAINDER] : ({operands, typeHint}) => {
            if (typeHint == TypeHint.DOUBLE) {
                function naiveFractionalRemainder (dividend : Ast, divisor : Ast) {
                    const absDivisor = functionCall("ABS", [divisor]);

                    return parentheses(
                        [
                            dividend,
                            "-",
                            functionCall(
                                "FLOOR",
                                [
                                    [
                                        dividend,
                                        "/",
                                        absDivisor
                                    ]
                                ]
                            ),
                            "*",
                            absDivisor
                        ],
                        false
                    );
                }
                const dividend = operands[0];
                const divisor = operands[1];

                return [
                    "CASE",
                    "WHEN", dividend, "= 1e999 THEN NULL",
                    "WHEN", dividend, "= -1e999 THEN NULL",
                    "WHEN", divisor, "= 1e999 THEN",
                    dividend,
                    "WHEN", divisor, "= -1e999 THEN",
                    dividend,
                    "WHEN", dividend, ">= 0 THEN", naiveFractionalRemainder(dividend, divisor),
                    "ELSE",
                    "-", naiveFractionalRemainder(parentheses(["-", dividend], false), divisor),
                    "END"
                ];
            } else {
                throw new Error(`FRACTIONAL_REMAINDER not implemented for ${typeHint}`);
            }
        },
        [OperatorType.ADDITION] : ({operands, typeHint}) => {
            if (typeHint == TypeHint.BIGINT_SIGNED) {
                return functionCall("bigint_add", operands);
            } else {
                return functionCall(
                    "COALESCE",
                    [
                        insertBetween(operands, "+"),
                        THROW_AST
                    ]
                );
            }
        },
        [OperatorType.SUBTRACTION] : ({operands, typeHint}) => {
            if (typeHint == TypeHint.BIGINT_SIGNED) {
                return functionCall("bigint_sub", operands);
            } else {
                return functionCall(
                    "COALESCE",
                    [
                        insertBetween(operands, "-"),
                        THROW_AST
                    ]
                );
            }
        },
        [OperatorType.MULTIPLICATION] : ({operands, typeHint}) => {
            if (typeHint == TypeHint.BIGINT_SIGNED) {
                return functionCall("bigint_mul", operands);
            } else {
                return functionCall(
                    "COALESCE",
                    [
                        insertBetween(operands, "*"),
                        THROW_AST
                    ]
                );
            }
        },
        [OperatorType.UNARY_MINUS] : ({operands, typeHint}) => {
            if (typeHint == TypeHint.BIGINT_SIGNED) {
                return functionCall("bigint_neg", operands);
            } else {
                return ["-", operands[0]];
            }
        },

        /*
            Mathematical Functions
            https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html
        */
        [OperatorType.ABSOLUTE_VALUE] : ({operands}) => functionCall("ABS", operands),
        [OperatorType.ARC_COSINE] : ({operands}) => functionCall("ACOS", operands),
        [OperatorType.ARC_SINE] : ({operands}) => functionCall("ASIN", operands),
        [OperatorType.ARC_TANGENT] : ({operands}) => functionCall("ATAN", operands),
        [OperatorType.ARC_TANGENT_2] : ({operands}) => functionCall("ATAN2", operands),
        [OperatorType.CUBE_ROOT] : ({operands}) => functionCall("CBRT", operands),
        [OperatorType.CEILING] : ({operands}) => functionCall("CEILING", operands),
        [OperatorType.COSINE] : ({operands}) => functionCall("COS", operands),
        [OperatorType.COTANGENT] : ({operands}) => functionCall("COT", operands),
        [OperatorType.DEGREES] : ({operands}) => [operands[0], "* (180.0/3.141592653589793)"],
        [OperatorType.NATURAL_EXPONENTIATION] : ({operands}) => functionCall("EXP", operands),
        [OperatorType.FLOOR] : ({operands}) => functionCall("FLOOR", operands),
        [OperatorType.LN] : ({operands}) => functionCall("LN", operands),
        [OperatorType.LOG] : ({operands}) => functionCall("LOG", operands),
        [OperatorType.LOG2] : ({operands}) => functionCall("LOG2", operands),
        [OperatorType.LOG10] : ({operands}) => functionCall("LOG10", operands),
        [OperatorType.PI] : () => functionCall("PI", []),
        [OperatorType.POWER] : ({operands}) => functionCall("POWER", operands),
        [OperatorType.RADIANS] : ({operands}) => [operands[0], "* (3.141592653589793/180.0)"],
        [OperatorType.RANDOM] : ({operands, typeHint}) => {
            if (typeHint == TypeHint.DOUBLE) {
                return functionCall("FRANDOM", operands);
            } else if (typeHint == TypeHint.BIGINT_SIGNED) {
                return functionCall("RANDOM", operands);
            } else {
                throw new Error(`RANDOM not implemented for ${typeHint}`);
            }
        },
        //[OperatorType.ROUND] : ({operands}) => functionCall("ROUND", operands),
        [OperatorType.SIGN] : ({operands}) => functionCall("SIGN", operands),
        [OperatorType.SINE] : ({operands}) => functionCall("SIN", operands),
        [OperatorType.SQUARE_ROOT] : ({operands}) => functionCall("SQRT", operands),
        [OperatorType.TANGENT] : ({operands}) => functionCall("TAN", operands),
        //[OperatorType.TRUNCATE] : ({operands}) => functionCall("TRUNCATE", operands),

        /*
            Date and Time Functions
            https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html
        */
        [OperatorType.CURRENT_DATE] : () => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d"),
                pascalStyleEscapeString("now")
            ]
        ),
        [OperatorType.CURRENT_TIMESTAMP_0] : () => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%S"),
                pascalStyleEscapeString("now")
            ]
        ),
        [OperatorType.CURRENT_TIMESTAMP_1] : () => functionCall(
            "substr",
            [
                functionCall(
                    "strftime",
                    [
                        pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                        pascalStyleEscapeString("now")
                    ]
                ),
                "1",
                "21"
            ]
        ),
        [OperatorType.CURRENT_TIMESTAMP_2] : () => functionCall(
            "substr",
            [
                functionCall(
                    "strftime",
                    [
                        pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                        pascalStyleEscapeString("now")
                    ]
                ),
                "1",
                "22"
            ]
        ),
        [OperatorType.CURRENT_TIMESTAMP_3] : () => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                pascalStyleEscapeString("now")
            ]
        ),
        [OperatorType.EXTRACT_YEAR] : ({operands}) => functionCall(
            "CAST",
            [
                [
                    functionCall(
                        "strftime",
                        [
                            pascalStyleEscapeString("%Y"),
                            operands[0]
                        ]
                    ),
                    "AS BIGINT"
                ]
            ]
        ),
        [OperatorType.EXTRACT_MONTH] : ({operands}) => functionCall(
            "CAST",
            [
                [
                    functionCall(
                        "strftime",
                        [
                            pascalStyleEscapeString("%m"),
                            operands[0]
                        ]
                    ),
                    "AS BIGINT"
                ]
            ]
        ),
        [OperatorType.EXTRACT_DAY] : ({operands}) => functionCall(
            "CAST",
            [
                [
                    functionCall(
                        "strftime",
                        [
                            pascalStyleEscapeString("%d"),
                            operands[0]
                        ]
                    ),
                    "AS BIGINT"
                ]
            ]
        ),
        [OperatorType.EXTRACT_HOUR] : ({operands}) => functionCall(
            "CAST",
            [
                [
                    functionCall(
                        "strftime",
                        [
                            pascalStyleEscapeString("%H"),
                            operands[0]
                        ]
                    ),
                    "AS BIGINT"
                ]
            ]
        ),
        [OperatorType.EXTRACT_MINUTE] : ({operands}) => functionCall(
            "CAST",
            [
                [
                    functionCall(
                        "strftime",
                        [
                            pascalStyleEscapeString("%M"),
                            operands[0]
                        ]
                    ),
                    "AS BIGINT"
                ]
            ]
        ),
        [OperatorType.EXTRACT_INTEGER_SECOND] : ({operands}) => functionCall(
            "CAST",
            [
                [
                    functionCall(
                        "strftime",
                        [
                            pascalStyleEscapeString("%S"),
                            operands[0]
                        ]
                    ),
                    "AS BIGINT"
                ]
            ]
        ),
        [OperatorType.EXTRACT_FRACTIONAL_SECOND_3] : ({operands}) => functionCall(
            "CAST",
            [
                [
                    functionCall(
                        "strftime",
                        [
                            pascalStyleEscapeString("%f"),
                            operands[0]
                        ]
                    ),
                    "AS DOUBLE"
                ]
            ]
        ),
        [OperatorType.LAST_DAY] : ({operands}) => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d"),
                operands[0],
                pascalStyleEscapeString("+1 month"),
                [
                    pascalStyleEscapeString("-"),
                    "||",
                    functionCall(
                        "strftime",
                        [
                            pascalStyleEscapeString("%d"),
                            operands[0]
                        ]
                    ),
                    "||",
                    pascalStyleEscapeString(" day")
                ]
            ]
        ),
        [OperatorType.TIMESTAMPADD_YEAR] : ({operands}) => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                operands[1],
                [
                    operands[0],
                    "||",
                    pascalStyleEscapeString(" year")
                ]
            ]
        ),
        /**
         * @todo Just use a polyfill, rather than trying to emulate with SQLite built-ins.
         * Seriously. But, for now, this actually works, which surprises me.
         */
        [OperatorType.TIMESTAMPADD_MONTH] : ({operands}, toSql, sqlfier) => {
            /*
                The following gives SQLite's and JS' understanding of what
                "adding months" means. However, it is different from what
                MySQL understands as "adding months".

                Since the function is named for MySQL's `TIMESTAMPADD()`,
                we follow MySQL's convention, and emultate MySQL's behaviour.

                functionCall(
                    "strftime",
                    [
                        pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                        operands[1],
                        [
                            operands[0],
                            "||",
                            pascalStyleEscapeString(" month")
                        ]
                    ]
                )
            */
            const rawDeltaMonth = operands[0];
            const dateTime = operands[1];
            const curYear = sqlfier.operatorSqlfier[OperatorType.EXTRACT_YEAR](
                OperatorNodeUtil.operatorNode1(
                    OperatorType.EXTRACT_YEAR,
                    [dateTime],
                    TypeHint.DATE_TIME
                ),
                toSql,
                sqlfier
            );
            const curMonth = sqlfier.operatorSqlfier[OperatorType.EXTRACT_MONTH](
                OperatorNodeUtil.operatorNode1(
                    OperatorType.EXTRACT_MONTH,
                    [dateTime],
                    TypeHint.DATE_TIME
                ),
                toSql,
                sqlfier
            );
            const curDay = sqlfier.operatorSqlfier[OperatorType.EXTRACT_DAY](
                OperatorNodeUtil.operatorNode1(
                    OperatorType.EXTRACT_DAY,
                    [dateTime],
                    TypeHint.DATE_TIME
                ),
                toSql,
                sqlfier
            );
            const curTimeComponent = functionCall(
                "strftime",
                [
                    pascalStyleEscapeString(" %H:%M:%f"),
                    dateTime
                ]
            );

            function lastDay (year : Ast, month : Ast) {
                return parentheses(
                    [
                        "CASE",
                        "WHEN", month, "= 2 THEN (CASE WHEN", year, "%4 = 0 THEN 29 ELSE 28 END)",
                        "WHEN", month, "IN(1,3,5,7,8,10,12) THEN 31",
                        "ELSE 30",
                        "END"
                    ],
                    false
                );

            }
            function setYearMonth (resultYear : Ast, resultMonth : Ast) {
                const lastDayOfResult = lastDay(resultYear, resultMonth);
                const lastDayOfAdd = parentheses(
                    ["CASE WHEN", curDay, ">", lastDayOfResult, "THEN", lastDayOfResult, "ELSE", curDay, "END"],
                    false
                );

                /**
                 * @todo Instead of `LPAD()`, use this?
                 * https://stackoverflow.com/a/9603175
                 */
                return [
                    functionCall("LPAD", [functionCall("CAST", [[resultYear, "AS TEXT"]]), "4", "'0'"]),
                    "|| '-' ||",
                    functionCall("LPAD", [functionCall("CAST", [[resultMonth, "AS TEXT"]]), "2", "'0'"]),
                    "|| '-' ||",
                    functionCall("LPAD", [functionCall("CAST", [[lastDayOfAdd, "AS TEXT"]]), "2", "'0'"]),
                    "||",
                    curTimeComponent
                ];
            }

            const monthsSince_0000_01 = parentheses(
                [curYear, "* 12 + (", curMonth, "-1) +", rawDeltaMonth],
                false
            );
            const resultYear = functionCall("FLOOR", [[monthsSince_0000_01, "/12"]]);
            const resultMonth = parentheses([monthsSince_0000_01, "%12 + 1"], false);

            return [
                "CASE",
                "WHEN", monthsSince_0000_01, "BETWEEN 0 AND 119999 THEN", setYearMonth(resultYear, resultMonth),
                "ELSE NULL",
                "END"
            ];
        },
        [OperatorType.TIMESTAMPADD_DAY] : ({operands}) => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                operands[1],
                insertBetween(
                    [
                        operands[0],
                        pascalStyleEscapeString(" day")
                    ],
                    "||"
                )
            ]
        ),
        [OperatorType.TIMESTAMPADD_HOUR] : ({operands}) => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                operands[1],
                insertBetween(
                    [
                        operands[0],
                        pascalStyleEscapeString(" hour")
                    ],
                    "||"
                )
            ]
        ),
        [OperatorType.TIMESTAMPADD_MINUTE] : ({operands}) => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                operands[1],
                insertBetween(
                    [
                        operands[0],
                        pascalStyleEscapeString(" minute")
                    ],
                    "||"
                )
            ]
        ),
        [OperatorType.TIMESTAMPADD_SECOND] : ({operands}) => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                operands[1],
                insertBetween(
                    [
                        operands[0],
                        pascalStyleEscapeString(" second")
                    ],
                    "||"
                )
            ]
        ),
        [OperatorType.TIMESTAMPADD_MILLISECOND] : ({operands}) => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                operands[1],
                insertBetween(
                    [
                        parentheses(
                            insertBetween(
                                [
                                    operands[0],
                                    "1000e0"
                                ],
                                "/"
                            ),
                            //canUnwrap
                            false
                        ),
                        pascalStyleEscapeString(" second")
                    ],
                    "||"
                )
            ]
        ),
        [OperatorType.TIMESTAMPDIFF_DAY] : ({operands}) => functionCall(
            "CAST",
            [
                [
                    functionCall(
                        "strftime",
                        [
                            pascalStyleEscapeString("%J"),
                            operands[1]
                        ]
                    ),
                    "-",
                    functionCall(
                        "strftime",
                        [
                            pascalStyleEscapeString("%J"),
                            operands[0]
                        ]
                    ),
                    "AS BIGINT"
                ]
            ]
        ),
        [OperatorType.TIMESTAMPDIFF_HOUR] : ({operands}) => functionCall(
            "CAST",
            [
                [
                    parentheses(
                        [
                            functionCall(
                                "strftime",
                                [
                                    pascalStyleEscapeString("%J"),
                                    operands[1]
                                ]
                            ),
                            "-",
                            functionCall(
                                "strftime",
                                [
                                    pascalStyleEscapeString("%J"),
                                    operands[0]
                                ]
                            )
                        ],
                        false
                    ),
                    "* 24 AS BIGINT"
                ]
            ]
        ),
        [OperatorType.TIMESTAMPDIFF_MINUTE] : ({operands}) => functionCall(
            "CAST",
            [
                [
                    parentheses(
                        [
                            functionCall(
                                "strftime",
                                [
                                    pascalStyleEscapeString("%J"),
                                    operands[1]
                                ]
                            ),
                            "-",
                            functionCall(
                                "strftime",
                                [
                                    pascalStyleEscapeString("%J"),
                                    operands[0]
                                ]
                            )
                        ],
                        false
                    ),
                    "* 24 * 60 AS BIGINT"
                ]
            ]
        ),
        [OperatorType.TIMESTAMPDIFF_SECOND] : ({operands}) => functionCall(
            "CAST",
            [
                [
                    parentheses(
                        [
                            functionCall(
                                "strftime",
                                [
                                    pascalStyleEscapeString("%J"),
                                    operands[1]
                                ]
                            ),
                            "-",
                            functionCall(
                                "strftime",
                                [
                                    pascalStyleEscapeString("%J"),
                                    operands[0]
                                ]
                            )
                        ],
                        false
                    ),
                    "* 24 * 60 * 60 AS BIGINT"
                ]
            ]
        ),
        [OperatorType.TIMESTAMPDIFF_MILLISECOND] : ({operands}) => {
            /*
                This naive implementation suffers from precision problems,
                functionCall(
                    "CAST",
                    [
                        [
                            parentheses(
                                [
                                    functionCall(
                                        "strftime",
                                        [
                                            pascalStyleEscapeString("%J"),
                                            operands[1]
                                        ]
                                    ),
                                    "-",
                                    functionCall(
                                        "strftime",
                                        [
                                            pascalStyleEscapeString("%J"),
                                            operands[0]
                                        ]
                                    )
                                ],
                                false
                            ),
                            "* 24 * 60 * 60 * 1000 AS BIGINT"
                        ]
                    ]
                )
            */
            function castAsBigInt (x : Ast) {
                return functionCall("CAST", [[x, "AS BIGINT"]]);
            }
            const diffDate = [
                parentheses(
                    [
                        functionCall(
                            "strftime",
                            [
                                pascalStyleEscapeString("%J"),
                                functionCall(
                                    "strftime",
                                    [
                                        pascalStyleEscapeString("%Y-%m-%d"),
                                        operands[1]
                                    ]
                                )
                            ]
                        ),
                        "-",
                        functionCall(
                            "strftime",
                            [
                                pascalStyleEscapeString("%J"),
                                functionCall(
                                    "strftime",
                                    [
                                        pascalStyleEscapeString("%Y-%m-%d"),
                                        operands[0]
                                    ]
                                )
                            ]
                        )
                    ],
                    false
                ),
                "* 24 * 60 * 60 * 1000"
            ];
            const diffHour = [
                parentheses(
                    [
                        functionCall(
                            "strftime",
                            [
                                pascalStyleEscapeString("%H"),
                                operands[1]
                            ]
                        ),
                        "-",
                        functionCall(
                            "strftime",
                            [
                                pascalStyleEscapeString("%H"),
                                operands[0]
                            ]
                        )
                    ],
                    false
                ),
                "* 60 * 60 * 1000"
            ];
            const diffMinute = [
                parentheses(
                    [
                        functionCall(
                            "strftime",
                            [
                                pascalStyleEscapeString("%M"),
                                operands[1]
                            ]
                        ),
                        "-",
                        functionCall(
                            "strftime",
                            [
                                pascalStyleEscapeString("%M"),
                                operands[0]
                            ]
                        )
                    ],
                    false
                ),
                "* 60 * 1000"
            ];
            const diffSecond = [
                parentheses(
                    [
                        functionCall(
                            "strftime",
                            [
                                pascalStyleEscapeString("%S"),
                                operands[1]
                            ]
                        ),
                        "-",
                        functionCall(
                            "strftime",
                            [
                                pascalStyleEscapeString("%S"),
                                operands[0]
                            ]
                        )
                    ],
                    false
                ),
                "* 1000"
            ];
            const diffMillisecond = [
                parentheses(
                    [
                        functionCall(
                            "substr",
                            [
                                functionCall(
                                    "strftime",
                                    [
                                        pascalStyleEscapeString("%f"),
                                        operands[1]
                                    ]
                                ),
                                "4"
                            ]
                        ),
                        "-",
                        functionCall(
                            "substr",
                            [
                                functionCall(
                                    "strftime",
                                    [
                                        pascalStyleEscapeString("%f"),
                                        operands[0]
                                    ]
                                ),
                                "4"
                            ]
                        )
                    ],
                    false
                )
            ];
            return castAsBigInt(insertBetween(
                [
                    diffDate,
                    diffHour,
                    diffMinute,
                    diffSecond,
                    diffMillisecond
                ],
                "+"
            ));
        },
        [OperatorType.UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR] : ({operands}) => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                operands[0]
            ]
        ),
        [OperatorType.UNIX_TIMESTAMP_NOW] : () => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%s"),
                pascalStyleEscapeString("now")
            ]
        ),

        /*
            Cast Functions and Operators
            https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html
        */

        [OperatorType.CAST_AS_DECIMAL] : ({operands : [arg, precision, scale]}) => functionCall(
            "decimal_ctor",
            [
                arg,
                precision,
                scale
            ]
        )/*functionCall(
            "CAST",
            [
                toSql(arg) + `AS DECIMAL(${toSql(precision)}, ${toSql(scale)})`
            ]
        )*/,

        [OperatorType.CAST_AS_DOUBLE] : ({operands}, toSql) => functionCall("CAST", [`${toSql(operands)} AS DOUBLE`]),

        [OperatorType.CAST_AS_BIGINT_SIGNED] : ({operands}, toSql) => functionCall("CAST", [`${toSql(operands)} AS BIGINT`]),

        /*
            Bit Functions and Operators
            https://dev.mysql.com/doc/refman/8.0/en/bit-functions.html
        */
        [OperatorType.BITWISE_AND] : ({operands}) => insertBetween(operands, "&"),
        [OperatorType.BITWISE_OR] : ({operands}) => insertBetween(operands, "|"),
        [OperatorType.BITWISE_XOR] : ({operands}) => [
            ["~", parentheses(insertBetween(operands, "&"), false)],
            "&",
            parentheses(insertBetween(operands, "|"), false)
        ],
        [OperatorType.BITWISE_NOT] : ({operands}) => ["~", operands],
        [OperatorType.BITWISE_LEFT_SHIFT] : ({operands}) => insertBetween(operands, "<<"),
        [OperatorType.BITWISE_RIGHT_SHIFT] : ({operands}) => insertBetween(operands, ">>"),

        /*
            Aggregate (GROUP BY) Function Descriptions
            https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html
        */

        [OperatorType.AGGREGATE_COUNT_ALL] : () => functionCall("COUNT", ["*"]),
        [OperatorType.AGGREGATE_COUNT_EXPR] : ({operands, operatorType}) => {
            if (operands.length == 2) {
                const [isDistinct, expr] = operands;
                if (
                    LiteralValueNodeUtil.isLiteralValueNode(isDistinct) &&
                    isDistinct.literalValue === true
                ) {
                    return functionCall("COUNT", [["DISTINCT", expr]]);
                } else {
                    return functionCall("COUNT", [expr]);
                }
            } else {
                throw new Error(`${operatorType} only implemented for 2 args`);
            }
        },
        [OperatorType.AGGREGATE_AVERAGE] : ({operands, operatorType}) => {
            if (operands.length == 2) {
                const [isDistinct, expr] = operands;
                if (
                    LiteralValueNodeUtil.isLiteralValueNode(isDistinct) &&
                    isDistinct.literalValue === true
                ) {
                    return functionCall("AVG", [["DISTINCT", expr]]);
                } else {
                    return functionCall("AVG", [expr]);
                }
            } else {
                throw new Error(`${operatorType} only implemented for 2 args`);
            }
        },
        [OperatorType.AGGREGATE_MAX] : ({operands}) => {
            return functionCall("MAX", operands);
        },
        [OperatorType.AGGREGATE_MIN] : ({operands}) => {
            return functionCall("MIN", operands);
        },
        [OperatorType.AGGREGATE_SUM] : ({operands, operatorType}) => {
            if (operands.length == 2) {
                const [isDistinct, expr] = operands;
                if (
                    LiteralValueNodeUtil.isLiteralValueNode(isDistinct) &&
                    isDistinct.literalValue === true
                ) {
                    return functionCall("SUM", [["DISTINCT", expr]]);
                } else {
                    return functionCall("SUM", [expr]);
                }
            } else {
                throw new Error(`${operatorType} only implemented for 2 args`);
            }
        },
        [OperatorType.AGGREGATE_GROUP_CONCAT_DISTINCT] : ({operands}) => functionCall(
            "GROUP_CONCAT",
            [
                ["DISTINCT", operands[0]]
            ]
        ),
        [OperatorType.AGGREGATE_GROUP_CONCAT_ALL] : ({operands}) => functionCall(
            "GROUP_CONCAT",
            operands
        ),

        [OperatorType.EXISTS] : ({operands : [query]}, toSql) => {
            if (QueryBaseUtil.isAfterFromClause(query)) {
                //EXISTS(... FROM table)
                if (QueryBaseUtil.isAfterSelectClause(query)) {
                    //EXISTS(SELECT x FROM table)
                    return functionCall("EXISTS", [query]);
                } else {
                    //EXISTS(FROM table)
                    return functionCall("EXISTS", [
                        "SELECT 1 " + toSql(query)
                    ]);
                }
            } else {
                if (QueryBaseUtil.isAfterSelectClause(query)) {
                    //EXISTS(SELECT x)
                    return functionCall("EXISTS", [query]);
                } else {
                    throw new Error(`Query should have either FROM or SELECT clause`);
                }
            }
        },

        /*
            https://dev.mysql.com/doc/refman/5.7/en/information-functions.html

            Information Functions
        */
        [OperatorType.CURRENT_SCHEMA] : () => pascalStyleEscapeString("main"),
        [OperatorType.CURRENT_USER] : () => "NULL",
        /*
            Custom library functions

            These functions are not standard SQL,
            but can be implemented using standard SQL.
        */
        [OperatorType.THROW_IF_NULL] : ({operands : [arg]}) => {
            return functionCall("COALESCE", [
                arg,
                THROW_AST
            ]);
        },
    },
    queryBaseSqlfier : (rawQuery, toSql) => {
        const sql = queryToSql(rawQuery, toSql, false);
        //console.log(sql);
        return sql;
    },
    caseValueSqlfier : (node) => {
        const result : Ast[] = [
            "CASE", node.value,
        ];
        for (const [compareValue, thenResult] of node.cases) {
            result.push(["WHEN", compareValue, "THEN", thenResult]);
        }
        if (node.else != undefined) {
            result.push(["ELSE", node.else]);
        }
        result.push("END");
        return result;
    },
    caseConditionSqlfier : (node) => {
        const result : Ast[] = [
            "CASE"
        ];
        for (const [condition, thenResult] of node.branches) {
            result.push(["WHEN", condition, "THEN", thenResult]);
        }
        if (node.else != undefined) {
            result.push(["ELSE", node.else]);
        }
        result.push("END");
        return result;
    }
};

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
    castAsDecimal,
    utcStringToTimestamp,
    TypeHint,
    Parentheses,
    pascalStyleEscapeString,
    parentheses,
} from "../dist";
import {LiteralValueType, LiteralValueNodeUtil} from "../dist/ast/literal-value-node";

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
    if (query.groupByClause == undefined) {
        if (query.havingClause != undefined) {
            /**
             * Workaround for `<empty grouping set>` not supported by SQLite
             */
            result.push("GROUP BY NULL");
            result.push(havingClauseToSql(query.havingClause, toSql).join(" "));
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
        [LiteralValueType.DECIMAL] : ({literalValue, precision, scale}, toSql) => toSql(
            castAsDecimal(
                literalValue,
                precision,
                scale
            ).ast
        ),
        [LiteralValueType.STRING] : ({literalValue}) => pascalStyleEscapeString(literalValue),
        [LiteralValueType.DOUBLE] : ({literalValue}) => escapeValue(literalValue),
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
        [OperatorType.COALESCE] : ({operatorType, operands}) => functionCall(operatorType, operands),
        [OperatorType.EQUAL] : ({operands}) => insertBetween(operands, "="),
        [OperatorType.NULL_SAFE_EQUAL] : ({operands}) => insertBetween(operands, "IS"),
        [OperatorType.LESS_THAN] : ({operands}) => insertBetween(operands, "<"),
        [OperatorType.GREATER_THAN] : ({operands}) => insertBetween(operands, ">"),
        [OperatorType.IN] : ({operands : [x, y, ...rest]}) => {
            if (rest.length == 0 && Parentheses.IsParentheses(y) && QueryBaseUtil.isQuery(y.ast)) {
                return [
                    x,
                    functionCall("IN", [y.ast])
                ];
            } else {
                return [
                    x,
                    functionCall("IN", [y, ...rest])
                ];
            }
        },
        [OperatorType.IS_NOT_NULL] : ({operands}) => [operands[0], "IS NOT NULL"],
        [OperatorType.IS_NULL] : ({operands}) => [operands[0], "IS NULL"],
        [OperatorType.LIKE] : ({operands}) => insertBetween(operands, "LIKE"),
        [OperatorType.LIKE_ESCAPE] : ({operands : [expr, pattern, escapeChar]}) => [
            expr, "LIKE", pattern, "ESCAPE", escapeChar
        ],
        [OperatorType.NOT_LIKE] : ({operands}) => insertBetween(operands, "NOT LIKE"),
        [OperatorType.NOT_LIKE_ESCAPE] : ({operands : [expr, pattern, escapeChar]}) => [
            expr, "NOT LIKE", pattern, "ESCAPE", escapeChar
        ],
        [OperatorType.NOT_EQUAL] : ({operands}) => insertBetween(operands, "<>"),

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

        /*
            String Functions and Operators
            https://dev.mysql.com/doc/refman/8.0/en/string-functions.html
        */
        [OperatorType.CONCAT] : ({operands}) => insertBetween(operands, "||"),

        /*
            Arithmetic Operators
            https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html
        */
        [OperatorType.SUBTRACTION] : ({operands}) => insertBetween(operands, "-"),
        [OperatorType.FRACTIONAL_DIVISION] : ({operands}) => insertBetween(operands, "/"),
        [OperatorType.INTEGER_DIVISION] : ({operands, typeHint}, toSql) => {
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
                                "/"
                            )
                        ) + " AS DOUBLE"
                    ]
                );
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
        [OperatorType.ADDITION] : ({operands}) => insertBetween(operands, "+"),
        [OperatorType.MULTIPLICATION] : ({operands}) => insertBetween(operands, "*"),
        [OperatorType.UNARY_MINUS] : ({operands}) => ["-", operands[0]],

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
        [OperatorType.DEGREES] : ({operands}) => functionCall("DEGREES", operands),
        [OperatorType.NATURAL_EXPONENTIATION] : ({operands}) => functionCall("EXP", operands),
        [OperatorType.FLOOR] : ({operands}) => functionCall("FLOOR", operands),
        [OperatorType.LN] : ({operands}) => functionCall("LN", operands),
        [OperatorType.LOG] : ({operands}) => functionCall("LOG", operands),
        [OperatorType.LOG2] : ({operands}) => functionCall("LOG2", operands),
        [OperatorType.LOG10] : ({operands}) => functionCall("LOG10", operands),
        [OperatorType.PI] : () => functionCall("PI", []),
        [OperatorType.POWER] : ({operands}) => functionCall("POWER", operands),
        [OperatorType.RADIANS] : ({operands}) => functionCall("RADIANS", operands),
        [OperatorType.RANDOM] : ({operands, typeHint}) => {
            if (typeHint == TypeHint.DOUBLE) {
                return functionCall("FRANDOM", operands);
            } else if (typeHint == TypeHint.BIGINT_SIGNED) {
                return functionCall("RANDOM", operands);
            } else {
                throw new Error(`RANDOM not implemented for ${typeHint}`);
            }
        },
        [OperatorType.ROUND] : ({operands}) => functionCall("ROUND", operands),
        [OperatorType.SIGN] : ({operands}) => functionCall("SIGN", operands),
        [OperatorType.SINE] : ({operands}) => functionCall("SIN", operands),
        [OperatorType.SQUARE_ROOT] : ({operands}) => functionCall("SQRT", operands),
        [OperatorType.TANGENT] : ({operands}) => functionCall("TAN", operands),
        [OperatorType.TRUNCATE] : ({operands}) => functionCall("TRUNCATE", operands),

        /*
            Date and Time Functions
            https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html
        */
        [OperatorType.TIMESTAMPADD_MILLISECOND] : ({operands}) => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                operands[0],
                insertBetween(
                    [
                        parentheses(
                            insertBetween(
                                [
                                    operands[1],
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
        [OperatorType.TIMESTAMPADD_DAY] : ({operands}) => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                operands[0],
                insertBetween(
                    [
                        operands[1],
                        pascalStyleEscapeString(" day")
                    ],
                    "||"
                )
            ]
        ),
        [OperatorType.UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR] : ({operands}) => functionCall(
            "strftime",
            [
                pascalStyleEscapeString("%Y-%m-%d %H:%M:%f"),
                operands[0]
            ]
        ),

        /*
            Cast Functions and Operators
            https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html
        */

        [OperatorType.CAST_AS_DECIMAL] : ({operands : [arg, precision, scale]}, toSql) => functionCall(
            "CAST",
            [
                toSql(arg) + `AS DECIMAL(${toSql(precision)}, ${toSql(scale)})`
            ]
        ),

        [OperatorType.CAST_AS_DOUBLE] : ({operands}, toSql) => functionCall("CAST", [`${toSql(operands)} AS DOUBLE`]),

        [OperatorType.CAST_AS_SIGNED_BIG_INTEGER] : ({operands}, toSql) => functionCall("CAST", [`${toSql(operands)} AS BIGINT`]),

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
        [OperatorType.AGGREGATE_MAX] : ({operands, operatorType}) => {
            if (operands.length == 2) {
                const [isDistinct, expr] = operands;
                if (
                    LiteralValueNodeUtil.isLiteralValueNode(isDistinct) &&
                    isDistinct.literalValue === true
                ) {
                    return functionCall("MAX", [["DISTINCT", expr]]);
                } else {
                    return functionCall("MAX", [expr]);
                }
            } else {
                throw new Error(`${operatorType} only implemented for 2 args`);
            }
        },
        [OperatorType.AGGREGATE_MIN] : ({operands, operatorType}) => {
            if (operands.length == 2) {
                const [isDistinct, expr] = operands;
                if (
                    LiteralValueNodeUtil.isLiteralValueNode(isDistinct) &&
                    isDistinct.literalValue === true
                ) {
                    return functionCall("MIN", [["DISTINCT", expr]]);
                } else {
                    return functionCall("MIN", [expr]);
                }
            } else {
                throw new Error(`${operatorType} only implemented for 2 args`);
            }
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

        [OperatorType.EXISTS] : ({operands : [query]}, toSql) => {
            if (QueryBaseUtil.isAfterFromClause(query)) {
                //EXISTS(... FROM table)
                if (QueryBaseUtil.isAfterSelectClause(query)) {
                    //EXISTS(SELECT x FROM table)
                    return functionCall("EXISTS", [query]);
                } else {
                    //EXISTS(FROM table)
                    return functionCall("EXISTS", [
                        "SELECT *" + toSql(query)
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
    },
    queryBaseSqlfier : (rawQuery, toSql) => {
        return queryToSql(rawQuery, toSql, false);
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

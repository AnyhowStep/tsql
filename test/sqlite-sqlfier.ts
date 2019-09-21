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
} from "../dist";
import {LiteralValueType} from "../dist/ast/literal-value-node";

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
            result.push(toSql(join.tableAst));
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
            result.push(toSql(sortExpr.ast));
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
    if (query.whereClause != undefined) {
        result.push(whereClauseToSql(query.whereClause, toSql).join(" "));
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
        [LiteralValueType.STRING] : ({literalValue}) => escapeValue(literalValue),
        [LiteralValueType.DOUBLE] : ({literalValue}) => escapeValue(literalValue),
        [LiteralValueType.BIGINT_SIGNED] : ({literalValue}) => escapeValue(literalValue),
        /**
         * @todo
         * SQLite doesn't support `BIGINT UNSIGNED` values
         */
        [LiteralValueType.BIGINT_UNSIGNED] : ({literalValue}) => escapeValue(literalValue),
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
        [OperatorType.GREATER_THAN] : ({operands}) => insertBetween(operands, ">"),
        [OperatorType.IS_NOT_NULL] : ({operands}) => [operands[0], "IS NOT NULL"],
        [OperatorType.IS_NULL] : ({operands}) => [operands[0], "IS NULL"],
        [OperatorType.NOT_EQUAL] : ({operands}) => insertBetween(operands, "<>"),

        /*
            Logical Operators
            https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html
        */
        [OperatorType.AND] : ({operands}) => insertBetween(operands, "AND"),
        [OperatorType.NOT] : ({operands}) => [
            "NOT",
            operands[0]
        ],
        [OperatorType.XOR] : ({operands}) => insertBetween(operands, "<>"),

        [OperatorType.CAST_AS_DOUBLE] : ({operands}, toSql) => functionCall("CAST", [`${toSql(operands)} AS DOUBLE`]),

        /*
            Arithmetic Operators
            https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html
        */
        [OperatorType.SUBTRACTION] : ({operands}) => insertBetween(operands, "-"),
        /**
         * In SQLite, `%` ONLY does integer remainder
         */
        [OperatorType.INTEGER_REMAINDER] : ({operands}) => insertBetween(operands, "%"),
        [OperatorType.ADDITION] : ({operands}) => insertBetween(operands, "+"),

        /*
            Mathematical Functions
            https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html
        */
        [OperatorType.ABSOLUTE_VALUE] : ({operands}) => functionCall("ABS", operands),
        [OperatorType.ARC_COSINE] : ({operands}) => {
            return functionCall("ACOS", operands);
        },

        [OperatorType.PI] : () => {
            return functionCall("PI", []);
        },

        /*
            Date and Time Functions
            https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html
        */

        [OperatorType.UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR] : ({operands}) => functionCall(
            "strftime",
            [
                escapeValue("%Y-%m-%d %H:%M:%f"),
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

        /*
            Aggregate (GROUP BY) Function Descriptions
            https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html
        */

        [OperatorType.AGGREGATE_COUNT_ALL] : () => functionCall("COUNT", ["*"]),

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
};

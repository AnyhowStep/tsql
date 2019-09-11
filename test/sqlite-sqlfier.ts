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
} from "../dist";

const insertBetween = AstUtil.insertBetween;

function selectClauseToSql (selectClause : SelectClause, toSql : (ast : Ast) => string) : string[] {
    const result : string[] = [];
    for (const selectItem of selectClause) {
        if (result.length > 0) {
            result.push(",");
        }
        if (ColumnUtil.isColumn(selectItem)) {
            result.push(
                [
                    escapeIdentifierWithDoubleQuotes(selectItem.tableAlias),
                    ".",
                    escapeIdentifierWithDoubleQuotes(selectItem.columnAlias)
                ].join(""),
                "AS",
                escapeIdentifierWithDoubleQuotes(
                    `${selectItem.tableAlias}${SEPARATOR}${selectItem.columnAlias}`
                )
            );
        } else if (ExprSelectItemUtil.isExprSelectItem(selectItem)) {
            result.push(
                toSql(selectItem.unaliasedAst),
                "AS",
                escapeIdentifierWithDoubleQuotes(
                    `${selectItem.tableAlias}${SEPARATOR}${selectItem.alias}`
                )
            );
            selectItem.unaliasedAst

        } else {
            throw new Error(`Not implemented`)
        }
    }
    return ["SELECT", ...result];
}

function fromClauseToSql (currentJoins : FromClauseUtil.AfterFromClause["currentJoins"], toSql : (ast : Ast) => string) : string[] {
    const result : string[] = [];
    for (const join of currentJoins) {
        if (join.joinType == JoinType.FROM) {
            result.push("FROM");
        } else {
            result.push(join.joinType, "JOIN");
        }
        if (isIdentifierNode(join.tableAst)) {
            result.push(toSql(join.tableAst));
        } else {
            result.push(toSql(join.tableAst));
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

export const sqliteSqlfier : Sqlfier = {
    identifierSqlfier : (identifierNode) => identifierNode.identifiers
        .map(escapeIdentifierWithDoubleQuotes)
        .join("."),
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
        [OperatorType.GREATER_THAN] : ({operands}) => insertBetween(operands, ">"),
        [OperatorType.NULL_SAFE_EQUAL] : ({operands}) => insertBetween(operands, "IS"),
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
        [OperatorType.MODULO] : ({operands}) => insertBetween(operands, "%"),
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
    },
    queryBaseSqlfier : (query, toSql) => {
        const result : string[] = [];
        if (query.selectClause != undefined) {
            result.push(selectClauseToSql(query.selectClause, toSql).join(" "));
        }
        if (query.fromClause != undefined && query.fromClause.currentJoins != undefined) {
            result.push(fromClauseToSql(query.fromClause.currentJoins, toSql).join(" "));
        }
        if (query.whereClause != undefined) {
            result.push(whereClauseToSql(query.whereClause, toSql).join(" "));
        }

        return result.join(" ");
    },
};

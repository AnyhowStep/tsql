import {OperatorType} from "../../operator-type";
import {
    Operand1,
    Operand2,
    Operand3,
    Operand1ToN,
    Operand2ToN,
    AnyArityOperand,
    Operand0,
} from "./operand";

export type OperatorOperand = {
    /*
        Comparison Functions and Operators
        https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html
    */
    [OperatorType.BETWEEN_AND]              : Operand3,
    [OperatorType.COALESCE]                 : Operand2ToN,
    [OperatorType.EQUAL]                    : Operand2,
    [OperatorType.NULL_SAFE_EQUAL]          : Operand2,
    [OperatorType.GREATER_THAN]             : Operand2,
    [OperatorType.GREATER_THAN_OR_EQUAL]    : Operand2,
    [OperatorType.GREATEST]                 : Operand2ToN,
    [OperatorType.IN_ARRAY]                 : Operand2ToN,
    [OperatorType.IN_QUERY]                 : Operand2,
    [OperatorType.IS_TRUE]                  : Operand1,
    [OperatorType.IS_FALSE]                 : Operand1,
    [OperatorType.IS_UNKNOWN]               : Operand1,
    [OperatorType.IS_NOT_TRUE]              : Operand1,
    [OperatorType.IS_NOT_FALSE]             : Operand1,
    [OperatorType.IS_NOT_UNKNOWN]           : Operand1,
    [OperatorType.IS_NOT_NULL]              : Operand1,
    [OperatorType.IS_NULL]                  : Operand1,
    [OperatorType.LEAST]                    : Operand2ToN,
    [OperatorType.LESS_THAN]                : Operand2,
    [OperatorType.LESS_THAN_OR_EQUAL]       : Operand2,
    //[OperatorType.LIKE]                     : Operand2,
    [OperatorType.LIKE_ESCAPE]              : Operand3,
    [OperatorType.NOT_BETWEEN_AND]          : Operand3,
    [OperatorType.NOT_EQUAL]                : Operand2,
    [OperatorType.NOT_NULL_SAFE_EQUAL]      : Operand2,
    [OperatorType.NOT_IN_ARRAY]             : Operand2ToN,
    [OperatorType.NOT_IN_QUERY]             : Operand2,
    //[OperatorType.NOT_LIKE]                 : Operand2,
    [OperatorType.NOT_LIKE_ESCAPE]          : Operand3,

    /*
        Logical Operators
        https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html
    */
    /**
     * With zero operands, this resolves to `TRUE`
     */
    [OperatorType.AND]                      : Operand1ToN,
    [OperatorType.NOT]                      : Operand1,
    /**
     * With zero operands, this resolves to `FALSE`
     */
    [OperatorType.OR]                       : Operand1ToN,
    [OperatorType.XOR]                      : Operand2,

    /*
        Control Flow Functions
        https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html
    */
    //[OperatorType.CASE]                     : Operand4ToN,
    //[OperatorType.CASE_WHEN]                : Operand3ToN,
    [OperatorType.IF]                       : Operand3,
    [OperatorType.IF_NULL]                  : Operand2,
    [OperatorType.NULL_IF_EQUAL]            : Operand2,

    /*
        String Functions and Operators
        https://dev.mysql.com/doc/refman/8.0/en/string-functions.html
    */
    [OperatorType.ASCII]                    : Operand1,
    [OperatorType.BIN]                      : Operand1,
    [OperatorType.BIT_LENGTH]               : Operand1,
    [OperatorType.CHAR_LENGTH]              : Operand1,
    [OperatorType.CONCAT]                   : Operand1ToN,
    [OperatorType.NULL_SAFE_CONCAT]         : Operand1ToN,
    [OperatorType.CONCAT_WS]                : Operand2ToN,
    [OperatorType.FROM_BASE64]              : Operand1,
    [OperatorType.HEX]                      : Operand1,
    [OperatorType.IN_STR]                   : Operand2,
    [OperatorType.LOWER]                    : Operand1,
    [OperatorType.LPAD]                     : Operand3,
    [OperatorType.LTRIM]                    : Operand1,
    [OperatorType.OCTET_LENGTH]             : Operand1,
    [OperatorType.POSITION]                 : Operand2,
    //[OperatorType.QUOTE]                    : Operand1,
    [OperatorType.REPEAT]                   : Operand2,
    [OperatorType.REPLACE]                  : Operand3,
    [OperatorType.REVERSE]                  : Operand1,
    [OperatorType.RPAD]                     : Operand3,
    [OperatorType.RTRIM]                    : Operand1,
    //[OperatorType.SUBSTR]                   : Operand2|Operand3,
    [OperatorType.TO_BASE64]                : Operand1,
    [OperatorType.TRIM]                     : Operand1,
    [OperatorType.UNHEX]                    : Operand1,
    [OperatorType.UPPER]                    : Operand1,

    /*
        Arithmetic Operators
        https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html
    */
    [OperatorType.INTEGER_DIVISION]         : Operand2,
    [OperatorType.FRACTIONAL_DIVISION]      : Operand2,
    [OperatorType.SUBTRACTION]              : Operand1ToN,
    [OperatorType.INTEGER_REMAINDER]        : Operand2,
    [OperatorType.FRACTIONAL_REMAINDER]     : Operand2,
    [OperatorType.ADDITION]                 : Operand1ToN,
    [OperatorType.MULTIPLICATION]           : Operand1ToN,
    [OperatorType.UNARY_MINUS]              : Operand1,

    /*
        Mathematical Functions
        https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html
    */
    [OperatorType.ABSOLUTE_VALUE]           : Operand1,
    [OperatorType.ARC_COSINE]               : Operand1,
    [OperatorType.ARC_SINE]                 : Operand1,
    [OperatorType.ARC_TANGENT]              : Operand1,
    [OperatorType.ARC_TANGENT_2]            : Operand2,
    [OperatorType.CEILING]                  : Operand1,
    [OperatorType.COSINE]                   : Operand1,
    [OperatorType.COTANGENT]                : Operand1,
    [OperatorType.DEGREES]                  : Operand1,
    [OperatorType.NATURAL_EXPONENTIATION]   : Operand1,
    [OperatorType.FLOOR]                    : Operand1,
    [OperatorType.LN]                       : Operand1,
    [OperatorType.LOG]                      : Operand2,
    [OperatorType.LOG2]                     : Operand1,
    [OperatorType.LOG10]                    : Operand1,
    [OperatorType.PI]                       : Operand0,
    [OperatorType.POWER]                    : Operand2,
    [OperatorType.RADIANS]                  : Operand1,
    [OperatorType.RANDOM]                   : Operand0,
    [OperatorType.ROUND]                    : Operand1|Operand2,
    [OperatorType.SIGN]                     : Operand1,
    [OperatorType.SINE]                     : Operand1,
    [OperatorType.SQUARE_ROOT]              : Operand1,
    [OperatorType.CUBE_ROOT]                : Operand1,
    [OperatorType.TANGENT]                  : Operand1,
    [OperatorType.TRUNCATE]                 : Operand2,

    /*
        Date and Time Functions
        https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html
    */
    [OperatorType.CURRENT_DATE]             : Operand0,
    //[OperatorType.CURRENT_TIME_0]           : Operand0,
    //[OperatorType.CURRENT_TIME_1]           : Operand0,
    //[OperatorType.CURRENT_TIME_2]           : Operand0,
    //[OperatorType.CURRENT_TIME_3]           : Operand0,
    [OperatorType.CURRENT_TIMESTAMP_0]      : Operand0,
    [OperatorType.CURRENT_TIMESTAMP_1]      : Operand0,
    [OperatorType.CURRENT_TIMESTAMP_2]      : Operand0,
    [OperatorType.CURRENT_TIMESTAMP_3]      : Operand0,
    [OperatorType.UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR]      : Operand1,
    //[OperatorType.LOCAL_STRING_TO_TIMESTAMP_CONSTRUCTOR]    : Operand1,
    [OperatorType.EXTRACT_FRACTIONAL_SECOND_3]  : Operand1,
    [OperatorType.EXTRACT_INTEGER_SECOND]   : Operand1,
    [OperatorType.EXTRACT_MINUTE]           : Operand1,
    [OperatorType.EXTRACT_HOUR]             : Operand1,
    [OperatorType.EXTRACT_DAY]              : Operand1,
    [OperatorType.EXTRACT_MONTH]            : Operand1,
    [OperatorType.EXTRACT_YEAR]             : Operand1,
    [OperatorType.LAST_DAY]                 : Operand1,
    [OperatorType.TIMESTAMPADD_MILLISECOND] : Operand2,
    [OperatorType.TIMESTAMPADD_SECOND]      : Operand2,
    [OperatorType.TIMESTAMPADD_MINUTE]      : Operand2,
    [OperatorType.TIMESTAMPADD_HOUR]        : Operand2,
    [OperatorType.TIMESTAMPADD_DAY]         : Operand2,
    [OperatorType.TIMESTAMPADD_MONTH]       : Operand2,
    [OperatorType.TIMESTAMPADD_YEAR]        : Operand2,
    [OperatorType.TIMESTAMPDIFF_MILLISECOND]: Operand2,
    [OperatorType.TIMESTAMPDIFF_SECOND]     : Operand2,
    [OperatorType.TIMESTAMPDIFF_MINUTE]     : Operand2,
    [OperatorType.TIMESTAMPDIFF_HOUR]       : Operand2,
    [OperatorType.TIMESTAMPDIFF_DAY]        : Operand2,
    /*
     * Have to figure out a safe way to implement this with SQLite
     */
    //[OperatorType.TIMESTAMPDIFF_MONTH]      : Operand2,
    /*
     * Have to figure out a safe way to implement this with SQLite
     */
    //[OperatorType.TIMESTAMPDIFF_YEAR]       : Operand2,
    [OperatorType.UNIX_TIMESTAMP_NOW]       : Operand0,

    /*
        Cast Functions and Operators
        https://dev.mysql.com/doc/refman/8.0/en/cast-functions.html
    */
    [OperatorType.CAST_AS_BINARY]       : Operand1,
    [OperatorType.CAST_AS_VARCHAR]          : Operand1|Operand2,
    [OperatorType.CAST_AS_DECIMAL]          : Operand3,
    [OperatorType.CAST_AS_DOUBLE]           : Operand1,
    [OperatorType.CAST_AS_JSON]             : Operand1,
    //[OperatorType.CAST_AS_N_CHAR]            : Operand1,
    [OperatorType.CAST_AS_BIGINT_SIGNED]   : Operand1,
    //[OperatorType.CAST_AS_UNSIGNED_BIG_INTEGER] : Operand1,

    /*
        Bit Functions and Operators
        https://dev.mysql.com/doc/refman/8.0/en/bit-functions.html
    */
    [OperatorType.BITWISE_AND]              : Operand1ToN,
    [OperatorType.BITWISE_NOT]              : Operand1,
    [OperatorType.BITWISE_OR]               : Operand1ToN,
    [OperatorType.BITWISE_XOR]              : Operand2,
    [OperatorType.BITWISE_LEFT_SHIFT]       : Operand2,
    [OperatorType.BITWISE_RIGHT_SHIFT]      : Operand2,

    /*
        Aggregate (GROUP BY) Function Descriptions
        https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html
    */
    [OperatorType.AGGREGATE_AVERAGE]        : Operand2,
    [OperatorType.AGGREGATE_COUNT_EXPR]     : Operand2,
    [OperatorType.AGGREGATE_COUNT_ALL]      : Operand0,
    [OperatorType.AGGREGATE_GROUP_CONCAT_DISTINCT]   : Operand1,
    [OperatorType.AGGREGATE_GROUP_CONCAT_ALL]        : Operand2,
    [OperatorType.AGGREGATE_MAX]            : Operand1,
    [OperatorType.AGGREGATE_MIN]            : Operand1,
    [OperatorType.AGGREGATE_POPULATION_STANDARD_DEVIATION]  : Operand1,
    [OperatorType.AGGREGATE_SAMPLE_STANDARD_DEVIATION]      : Operand1,
    [OperatorType.AGGREGATE_SUM]            : Operand2,
    [OperatorType.AGGREGATE_POPULATION_VARIANCE]    : Operand1,
    [OperatorType.AGGREGATE_SAMPLE_VARIANCE]        : Operand1,

    /*
        https://dev.mysql.com/doc/refman/5.5/en/exists-and-not-exists-subqueries.html

        Subqueries with `EXISTS` or `NOT EXISTS`
    */
    [OperatorType.EXISTS]   : Operand1,

    /*
        https://dev.mysql.com/doc/refman/5.7/en/information-functions.html

        Information Functions
    */
    [OperatorType.CURRENT_SCHEMA]     : Operand0,
    [OperatorType.CURRENT_USER]         : Operand0,

    /*
        Library Extensions that can be implemented with standard SQL.
    */
    [OperatorType.THROW_IF_NULL] : Operand1,
};

type AssertAssignable<ExpectedT, _ActualT extends ExpectedT> = never;

const _assertOperatorOperandComplete : AssertAssignable<
    { [operatorType in OperatorType] : AnyArityOperand },
    OperatorOperand
> = undefined as never;
_assertOperatorOperandComplete;

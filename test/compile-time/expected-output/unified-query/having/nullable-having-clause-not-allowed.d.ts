import * as tsql from "../../../../../dist";
/**
 * https://github.com/microsoft/TypeScript/issues/33143
 *
 * Seems like adding this test changes the error message of the `WHERE` clause test.
 */
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: undefined;
    }>;
    selectClause: undefined;
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: undefined;
    groupByClause: undefined;
}>;

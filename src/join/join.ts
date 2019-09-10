import * as tm from "type-mapping";
import {ColumnMap} from "../column-map";
import {Key} from "../key";
import {OnClause} from "../on-clause";
import {Ast} from "../ast";

export enum JoinType {
    FROM  = "FROM",
    INNER = "INNER",
    LEFT  = "LEFT",
    /**
     * @todo Remove this?
     */
    RIGHT = "RIGHT",
    CROSS = "CROSS",
};
export const JoinTypeValues : readonly JoinType[] = tm.EnumUtil.getValues(JoinType);

export interface JoinData {
    readonly tableAlias : string,
    readonly nullable : boolean,
    /**
     * These columns can have their types narrowed.
     * For example, with the `IS NULL` or `IS NOT NULL` or `=` operators.
     */
    readonly columns : ColumnMap,

    /**
     * Needed for multi-table `UPDATE` statements.
     * So, we will know the data type of each column.
     */
    readonly originalColumns : ColumnMap,

    /**
     * Needed for `whereEqPrimaryKey()`
     */
    readonly primaryKey : undefined|Key;

    /**
     * Needed for `whereEqCandidateKey()`
     */
    readonly candidateKeys : readonly Key[];

    /**
     * Needed for multi-table `DELETE` statements.
     * We need to know which tables we can delete rows from.
     */
    readonly deleteEnabled : boolean,

    /**
     * Needed for multi-table `UPDATE` statements.
     * We need to know which columns are mutable.
     */
    readonly mutableColumns : readonly string[];
}

/**
 * @todo Make this invariant
 */
export interface IJoin<DataT extends JoinData=JoinData> {
    /**
     * Used for duplicate `tableAlias` detection.
     * ```sql
     *  SELECT
     *      *
     *  FROM
     *      myTable
     *  CROSS JOIN
     *      myTable --Error, `myTable` already used in same query; consider aliasing
     * ```
     */
    readonly tableAlias : DataT["tableAlias"],
    /**
     * If `true`, this table may be missing from a `JOIN`.
     * For example, as a result of a `LEFT/RIGHT JOIN`.
     */
    readonly nullable : DataT["nullable"],
    /**
     * We keep our own copy of the `ColumnMap` because
     * we may decide to make some fields nullable (`LEFT JOIN`)
     * or change their type entirely (`WHERE columnAlias = 34`).
     */
    readonly columns : DataT["columns"],

    /**
     * Needed for multi-table `UPDATE` statements.
     * So, we will know the data type of each column.
     */
    readonly originalColumns : DataT["originalColumns"],

    /**
     * Needed for `whereEqPrimaryKey()`
     */
    readonly primaryKey : DataT["primaryKey"];

    /**
     * Needed for `whereEqCandidateKey()`
     */
    readonly candidateKeys : readonly Key[];

    /**
     * Needed for multi-table `DELETE` statements.
     * We need to know which tables we can delete rows from.
     */
    readonly deleteEnabled : DataT["deleteEnabled"],

    /**
     * Needed for multi-table `UPDATE` statements.
     * We need to know which columns are mutable.
     */
    readonly mutableColumns : DataT["mutableColumns"];

    /**
     * The type of `JOIN`.
     *
     * `FROM` is considered a "type" or `JOIN`.
     * We also have `INNER`, `LEFT`, `RIGHT`, `CROSS`.
     */
    readonly joinType : JoinType,
    /**
     * + `FROM` and `CROSS JOIN` do not have `ON` clause.
     * + All other `JOIN`s have `ON` clause.
     */
    readonly onClause : OnClause|undefined;
    /**
     * The AST for a joined table could be as simple as an identifier...
     * Or as complex as a sub-query!
     */
    readonly tableAst : Ast;
}

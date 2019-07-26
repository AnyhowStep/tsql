import * as tm from "type-mapping";
import {IAliasedTable} from "../aliased-table";
import {ColumnMap} from "../column-map";
import {IColumn} from "../column";

export enum JoinType {
    FROM  = "FROM",
    INNER = "INNER",
    LEFT  = "LEFT",
    RIGHT = "RIGHT",
    CROSS = "CROSS",
};
export const JoinTypeValues : readonly JoinType[] = tm.EnumUtil.getValues(JoinType);

export interface JoinData {
    readonly aliasedTable : IAliasedTable,
    readonly columns : ColumnMap,
    readonly nullable : boolean,
}

export interface IJoin<DataT extends JoinData=JoinData> {
    /**
     * We may `JOIN` to an `ITable` or an `IAliasedTable`.
     *
     * An `IAliasedTable` is a `SELECT` expression with an alias.
     *
     * ```sql
     * JOIN (SELECT app.appId, app.name FROM app) AS tmp
     * ```
     */
    readonly aliasedTable : DataT["aliasedTable"],
    /**
     * We keep our own copy of the `ColumnMap` because
     * we may decide to make some fields nullable (`LEFT JOIN`)
     * or change their type entirely (`WHERE columnAlias = 34`).
     */
    readonly columns : DataT["columns"],
    /**
     * If `true`, this table may be missing from a `JOIN`.
     * For example, as a result of a `LEFT/RIGHT JOIN`.
     */
    readonly nullable : DataT["nullable"],

    /**
     * The type of `JOIN`.
     *
     * `FROM` is considered a "type" or `JOIN`.
     * We also have `INNER`, `LEFT`, `RIGHT`, `CROSS`.
     */
    readonly joinType : JoinType,
    /**
     * The "from" and "to" columns must have the same length
     * ```sql
     * FROM
     *  `from`
     * JOIN
     *  `to`
     * ON
     *  `from`.`x` = `to`.`x`,
     *  `from`.`y` = `to`.`y`
     * ```
     */
    readonly from : readonly IColumn[],
    /**
     * The "from" and "to" columns must have the same length
     * ```sql
     * FROM
     *  `from`
     * JOIN
     *  `to`
     * ON
     *  `from`.`x` = `to`.`x`,
     *  `from`.`y` = `to`.`y`
     * ```
     */
    readonly to : readonly IColumn[],
}
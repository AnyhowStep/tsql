import * as tm from "type-mapping";
import {Ast} from "../ast";

export interface ColumnData {
    readonly tableAlias : string;
    readonly columnAlias : string;
    /**
     * @todo Change this to `unknown` and fix errors
     */
    readonly mapper : tm.SafeMapper<any>;
}
export interface IColumn<DataT extends ColumnData=ColumnData> {
    /**
     * The alias of the table that this column belongs to.
     *
     * An aliased expression has this set to `typeof ALIASED`
     */
    readonly tableAlias : DataT["tableAlias"];
    /**
     * The alias of this column
     */
    readonly columnAlias : DataT["columnAlias"];
    /**
     * The mapper that validates/converts raw column values for use
     */
    readonly mapper : DataT["mapper"];

    /**
     * ```sql
     *  (
     *      SELECT
     *          --The `unaliasedAst` of this column is `undefined`
     *          myTable.myColumn,
     *          --The `unaliasedAst` of this column is `RAND()`
     *          RAND() AS `__aliased--curTime` --This is an ExprSelectItem
     *      FROM
     *          myTable
     *      ORDER BY
     *          `__aliased--curTime`  ASC
     *  )
     * ```
     */
    readonly unaliasedAst : undefined|Ast;
}
export type IAnonymousColumn<T> = IColumn<{
    tableAlias : string,
    columnAlias : string,
    mapper : tm.SafeMapper<T>,
}>;

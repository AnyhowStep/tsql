import {ExprColumnData, IExprColumn} from "./expr-column";
import {ColumnUtil} from "../column";
import {SortDirection} from "../sort-direction";
import {Ast} from "../ast";

export class ExprColumn<DataT extends ExprColumnData> implements IExprColumn<DataT> {
    readonly tableAlias : DataT["tableAlias"];
    readonly columnAlias : DataT["columnAlias"];
    readonly mapper : DataT["mapper"];
    readonly isAggregate : DataT["isAggregate"];

    readonly unaliasedAst : undefined|Ast;

    /**
     * You should never need to explicitly instantiate an `ExprColumn`.
     *
     * @param data
     * @param unaliasedAst
     */
    constructor (
        data : DataT,
        unaliasedAst : undefined|Ast,
    ) {
        this.tableAlias = data.tableAlias;
        this.columnAlias = data.columnAlias;
        this.mapper = data.mapper;
        this.isAggregate = data.isAggregate;

        this.unaliasedAst = unaliasedAst;
    }

    /**
     * ```sql
     * SELECT
     *  *
     * FROM
     *  myTable
     * ORDER BY
     *  myTable.myColumn ASC
     * ```
     */
    asc () : ColumnUtil.Asc<this> {
        return ColumnUtil.asc(this);
    }
    /**
     * ```sql
     * SELECT
     *  *
     * FROM
     *  myTable
     * ORDER BY
     *  myTable.myColumn DESC
     * ```
     */
    desc () : ColumnUtil.Desc<this> {
        return ColumnUtil.desc(this);
    }
    /**
     * ```sql
     * SELECT
     *  *
     * FROM
     *  myTable
     * ORDER BY
     *  myTable.myColumn ASC,
     *  myTable.myOtherColumn DESC
     * ```
     */
    sort (sortDirection : SortDirection) : ColumnUtil.Sort<this> {
        return ColumnUtil.sort(this, sortDirection);
    }
}

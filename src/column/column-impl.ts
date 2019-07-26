import {ColumnData, IColumn} from "./column";
import * as ColumnUtil from "./util";
import {SortDirection} from "../sort-direction";
import {Ast} from "../ast";

export class Column<DataT extends ColumnData> implements IColumn<DataT> {
    readonly tableAlias : DataT["tableAlias"];
    readonly columnAlias : DataT["columnAlias"];
    readonly mapper : DataT["mapper"];

    readonly unaliasedAst : undefined|Ast;

    /**
     * You should never need to explicitly instantiate a `Column`.
     * Use `myTable.addColumns()` instead.
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

        this.unaliasedAst = unaliasedAst;
    }

    /**
     * ```sql
     * SELECT
     *  myTable.myColumn AS alias
     * FROM
     *  myTable
     * ```
     *
     * @param alias - The new column name
     */
    readonly as = <AliasT extends string> (alias : AliasT) : ColumnUtil.As<Column<DataT>, AliasT> => {
        return ColumnUtil.as(this, alias);
    };

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
    readonly asc = () : ColumnUtil.Asc<Column<DataT>> => {
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
    readonly desc = () : ColumnUtil.Desc<Column<DataT>> => {
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
    readonly sort = (sortDirection : SortDirection) : ColumnUtil.Sort<Column<DataT>> => {
        return ColumnUtil.sort(this, sortDirection);
    }
}

import {AliasedTableData, IAliasedTable} from "../aliased-table";
import {IExprSelectItem, ExprSelectItemData} from "../expr-select-item";
import {Ast} from "../ast";
import {DerivedTableUtil} from "../derived-table";
import {ExprUtil, IExpr, ExprData} from "../expr";
import {SortDirection} from "../sort-direction";

/**
 * Meant to be a combination of `DerivedTable` and `AliasedExpr`.
 */
export class DerivedTableSelectItem<
    DataT extends AliasedTableData & ExprData & ExprSelectItemData
> implements IAliasedTable<DataT>, IExpr<DataT>, IExprSelectItem<DataT> {
    readonly mapper : DataT["mapper"];
    readonly isLateral : DataT["isLateral"];
    readonly tableAlias : DataT["tableAlias"];
    readonly alias : DataT["alias"];
    readonly columns : DataT["columns"];
    readonly usedRef : DataT["usedRef"];

    readonly ast : Ast;
    readonly unaliasedAst : Ast;

    constructor (
        data : DataT,
        unaliasedAst : Ast
    ) {
        this.mapper = data.mapper;
        this.isLateral = data.isLateral;
        this.tableAlias = data.tableAlias;
        this.alias = data.alias;
        this.columns = data.columns;
        this.usedRef = data.usedRef;

        this.ast = unaliasedAst;
        this.unaliasedAst = unaliasedAst;
    }

    /**
     * For now, the moment you use the `LATERAL` modifier,
     * it can no longer be used as an expression or aliased expression.
     *
     * No real reason for this rule, just laziness.
     */
    lateral () : DerivedTableUtil.Lateral<this> {
        return DerivedTableUtil.lateral(this);
    }

    /**
     * For now, the moment you try to re-alias,
     * it can no longer be used as a derived table.
     *
     * No real reason for this rule, just laziness.
     *
     * -----
     *
     * If you are running into "max instantiation depth" errors,
     * consider adding explicit `TableExpr<>` type annotations.
     *
     * If that doesn't help,
     * consider using `ExprUtil.as()` instead.
     *
     * Also, consider reading this to understand my frustration,
     * https://github.com/microsoft/TypeScript/issues/29511
     *
     * @param alias
     */
    as <AliasT extends string> (
        alias : AliasT
    ) : ExprUtil.As<this, AliasT> {
        return ExprUtil.as(this, alias);
    }

    /**
     * ```sql
     * ORDER BY
     *  RAND() ASC
     * ```
     */
    asc () : ExprUtil.Asc<this> {
        return ExprUtil.asc(this);
    }
    /**
     * ```sql
     * ORDER BY
     *  RAND() DESC
     * ```
     */
    desc () : ExprUtil.Desc<this> {
        return ExprUtil.desc(this);
    }
    /**
     * ```sql
     * ORDER BY
     *  (myTable.myColumn IS NOT NULL) ASC,
     *  RAND() DESC
     * ```
     */
    sort (sortDirection : SortDirection) : ExprUtil.Sort<this> {
        return ExprUtil.sort(this, sortDirection);
    }
}

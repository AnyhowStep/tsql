import * as tm from "type-mapping";
import {IUsedRef} from "../used-ref";
import {Ast} from "../ast";

export interface ExprSelectItemData {
    readonly mapper : tm.SafeMapper<any>;

    readonly tableAlias : string;
    readonly alias : string;

    readonly usedRef : IUsedRef;
    readonly isAggregate : boolean;
}

/**
 * Could be an aliased expression, or an aliased subquery with one expression selected.
 */
//There doesn't seem to be a point in making a class for this...
export interface IExprSelectItem<DataT extends ExprSelectItemData=ExprSelectItemData> {
    /**
     * The mapper that validates/converts raw values for use
     */
    readonly mapper : DataT["mapper"];

    /**
     * The table alias.
     *
     * ```sql
     * SELECT
     *  --The `tableAlias` is `myTable`
     *  --The `alias` is `myAlias`
     *  myTable.myColumn AS myAlias
     * FROM
     *  myTable
     * ```
     *
     * ```sql
     * SELECT
     *  --The `tableAlias` is `$aliased`
     *  --The `alias` is `myAlias`
     *  RAND() AS myAlias
     * ```
     */
    readonly tableAlias : DataT["tableAlias"];

    /**
     * The alias.
     *
     * ```sql
     * SELECT
     *  --The `tableAlias` is `myTable`
     *  --The `alias` is `myAlias`
     *  myTable.myColumn AS myAlias
     * FROM
     *  myTable
     * ```
     */
    readonly alias : DataT["alias"];

    /**
     * The columns used by this expression.
     * ```sql
     * SELECT
     *  --The `usedRef` of this expression are the two columns involved
     *  (myTable.myColumn + otherTable.otherColumn)
     * FROM
     *  myTable
     * JOIN
     *  otherTable
     * ON
     *  myTable.id = otherTable.id
     * ```
     */
    readonly usedRef : DataT["usedRef"];

    readonly isAggregate : DataT["isAggregate"];

    /**
     * The AST without the `AS alias` part.
     *
     * The full AST would be,
     * ```sql
     * (expr) AS alias
     * ```
     *
     * But `unaliasedAst` only has,
     * ```sql
     * (expr)
     * ```
     */
    readonly unaliasedAst : Ast;
}

export type IAnonymousExprSelectItem<TypeT, IsAggregateT extends boolean> = (
    IExprSelectItem<{
        mapper : tm.SafeMapper<TypeT>,

        tableAlias : string,
        alias : string,

        usedRef : IUsedRef,
        isAggregate : IsAggregateT,
    }>
);

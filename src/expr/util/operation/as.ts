import {IExpr} from "../../expr";
import {ExprImpl} from "../../expr-impl";
import {IExprSelectItem, ExprSelectItemData} from "../../../expr-select-item";
import {Ast} from "../../../ast";
import {ALIASED} from "../../../constants";

/**
 * An aliased expression
 *
 * ```sql
 *  SELECT
 *      (1+2) AS x --This is an `AliasedExpr`
 * ```
 *
 * -----
 *
 * ### Using `AliasedExpr` as "normal" expression
 *
 * Normally, you cannot use an aliased expression as a "normal" expression.
 *
 * This is usually invalid,
 * ```sql
 *  SELECT
 *      (((1+2) AS x) + 3) AS y
 * ```
 *
 * However, `tsql` allows this!
 *
 * When the query is generated, it extracts the inner unaliased expression,
 *
 * ```sql
 *  SELECT
 *      ((1+2) + 3) AS y
 * ```
 *
 * -----
 *
 * Allowing the above lets us write composable expressions that
 * can also be used in `SELECT` clauses more consistently!
 *
 * For example,
 * ```ts
 *  function x () {
 *      return tsql.add(1, 2).as("x");
 *  }
 *  //SELECT (1+2) AS x, (1+2+3) AS y
 *  tsql.select(() => [
 *      x(),
 *      tsql.add(x(), 3).as("y"),
 *  ]);
 *  //SELECT (1+2) AS x, (1+2+3+4+5) AS y
 *  tsql.select(() => [
 *      x(),
 *      tsql.add(x(), 3, 4, 5).as("y"),
 *  ]);
 * ```
 *
 * If we did not allow aliased expressions to be used as "normal" expressions,
 * we would have an increased risk of typos,
 *
 * ```ts
 *  function x () {
 *      //Removed `.as("x")`
 *      return tsql.add(1, 2);
 *  }
 *  //SELECT (1+2) AS x, (1+2+3) AS y
 *  tsql.select(() => [
 *      x().as("x"),
 *      tsql.add(x(), 3).as("y"),
 *  ]);
 *  //Intended: SELECT (1+2) AS x, (1+2+3+4+5) AS y
 *  //Actual  : SELECT (1+2) AS typo, (1+2+3+4+5) AS y
 *  tsql.select(() => [
 *      x().as("typo"),
 *      tsql.add(x(), 3, 4, 5).as("y"),
 *  ]);
 * ```
 *
 * -----
 *
 * ### Re-aliasing
 *
 * Normally, you can only alias an expression once,
 * ```sql
 *  SELECT
 *      (1+2) AS x AS y --Error: Cannot alias an expression more than once!
 * ```
 *
 * However, `tsql` allows this!
 *
 * When the query is generated, it uses the **last** set alias,
 * ```sql
 *  SELECT
 *      (1+2) AS y
 * ```
 *
 * -----
 *
 * With re-aliasing, you can set a **default alias** for your composable expressions.
 * Then, when you want a different alias, you can change it.
 *
 * For example,
 * ```ts
 *  function x () {
 *      //Default alias is `x`
 *      return tsql.add(1, 2).as("x");
 *  }
 *  //SELECT (1+2) AS x, (1+2+3) AS y
 *  tsql.select(() => [
 *      x(),
 *      tsql.add(x(), 3).as("y"),
 *  ]);
 *  //SELECT (1+2) AS realiased, (1+2+3+4+5) AS y
 *  tsql.select(() => [
 *      x().as("realiased"),
 *      tsql.add(x(), 3, 4, 5).as("y"),
 *  ]);
 * ```
 *
 */
export class AliasedExpr<
    DataT extends ExprSelectItemData
> extends ExprImpl<
    DataT["mapper"],
    DataT["usedRef"]
> implements IExprSelectItem<
    DataT
> {
    readonly tableAlias : DataT["tableAlias"];
    readonly alias : DataT["alias"];

    readonly unaliasedAst : Ast;

    constructor (data : DataT, ast : Ast) {
        super(data, ast);

        this.tableAlias = data.tableAlias;
        this.alias = data.alias;
        this.unaliasedAst = ast;
    }
}

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type AsImpl<
    AliasT extends string,
    MapperT extends IExpr["mapper"],
    UsedRefT extends IExpr["usedRef"]
> = (
    AliasedExpr<{
        mapper : MapperT,
        tableAlias : typeof ALIASED,
        alias : AliasT,
        usedRef : UsedRefT,
    }>
);
export type As<ExprT extends IExpr, AliasT extends string> = (
    AsImpl<
        AliasT,
        ExprT["mapper"],
        ExprT["usedRef"]
    >
);
export function as<ExprT extends IExpr, AliasT extends string> (
    expr : ExprT,
    alias : AliasT
) : As<ExprT, AliasT> {
    const result : As<ExprT, AliasT> = new AliasedExpr(
        {
            mapper : expr.mapper,
            tableAlias : ALIASED,
            alias,
            usedRef : expr.usedRef,
        },
        expr.ast
    )
    return result;
}

import {ExprImpl} from "../expr";
import {IExprSelectItem, ExprSelectItemData} from "../expr-select-item";
import {Ast} from "../ast";

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

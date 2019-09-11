import {IFromClause} from "../../../from-clause";
import {HavingDelegate} from "../../having-delegate";
import {HavingClause} from "../../having-clause";
import {ColumnRefUtil} from "../../../column-ref";
import * as ExprLib from "../../../expr-library";
import {allowedColumnRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";
import {IAnonymousColumn} from "../../../column";
import {IAnonymousExpr, ExprUtil} from "../../../expr";
import {RawExprUtil} from "../../../raw-expr";

/**
 * Returns the MySQL equivalent of `havingClause AND havingDelegate(columns)`
 *
 * -----
 *
 * For now, this is basically the same as `WhereClauseUtil.where<>()`.
 *
 * They will diverge when,
 * + The `HAVING` clause enforces proper `GROUP BY` interactions.
 *
 * -----
 *
 * @todo `HAVING` clause should only  be allowed **AFTER** `GROUP BY` clause or
 * PostgreSQL and SQLite will always throw an error!
 *
 * @param fromClause
 * @param havingClause
 * @param havingDelegate
 */
export function having<
    FromClauseT extends IFromClause
> (
    fromClause : FromClauseT,
    havingClause : HavingClause|undefined,
    havingDelegate : HavingDelegate<FromClauseT>
) : (
    HavingClause
) {
    const columns = allowedColumnRef(fromClause);
    const operand : (
        boolean|IAnonymousColumn<boolean>|IAnonymousExpr<boolean>
    ) = havingDelegate(ColumnRefUtil.tryFlatten(
        columns
    ));

    UsedRefUtil.assertAllowed(
        { columns },
        RawExprUtil.usedRef(operand)
    );

    return (
        havingClause == undefined ?
        ExprUtil.fromRawExpr(operand) :
        ExprLib.and(havingClause, operand)
    );
}

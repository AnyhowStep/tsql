import {IFromClause} from "../../../from-clause";
import {WhereDelegate} from "../../where-delegate";
import {WhereClause} from "../../where-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {IAnonymousExpr} from "../../../expr";
import {and} from "../../../expr-library";

/**
 * Returns the MySQL equivalent of `whereClause AND whereDelegate(columns)`
 *
 * @param fromClause
 * @param whereClause
 * @param whereDelegate
 */
export function where<
    FromClauseT extends IFromClause
> (
    fromClause : FromClauseT,
    whereClause : WhereClause,
    whereDelegate : WhereDelegate<FromClauseT>
) : (
    IAnonymousExpr<boolean>
) {
    const columns = ColumnRefUtil.fromFromClause(fromClause);
    const operand = whereDelegate(columns);
    return (
        whereClause == undefined ?
        operand :
        and(whereClause, operand)
    );
}

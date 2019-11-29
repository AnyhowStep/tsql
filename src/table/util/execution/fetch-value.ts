import {SelectConnection, ExecutionUtil} from "../../../execution";
import {WhereDelegate} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {SelectValueDelegate, SelectClauseUtil} from "../../../select-clause";
import {QueryUtil} from "../../../unified-query";
import {ITable} from "../../table";
import {AnyBuiltInExpr} from "../../../raw-expr";

export function fetchValue<
    TableT extends ITable,
    BuiltInExprT extends AnyBuiltInExpr
> (
    table : TableT,
    connection : SelectConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    selectValueDelegate : SelectValueDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >,
        undefined,
        BuiltInExprT
    >
) : ExecutionUtil.FetchValueReturnType<
    /**
     * @todo Report assignability bug to TS issues page
     */
    /*
        QueryUtil.SelectValue<
            QueryUtil.From<
                QueryUtil.NewInstance,
                this
            >,
            BuiltInExprT
        >
    */
    QueryUtil.SelectNoSelectClause<
        QueryUtil.From<
            QueryUtil.NewInstance,
            TableT
        >,
        SelectClauseUtil.ValueFromRawExpr<BuiltInExprT>
    >
> {
    try {
        return QueryUtil.newInstance()
            .from<TableT>(
                table as (
                    TableT &
                    QueryUtil.AssertValidCurrentJoin<QueryUtil.NewInstance, TableT>
                )
            )
            .where(whereDelegate)
            .selectValue(selectValueDelegate as any)
            .fetchValue(connection) as ExecutionUtil.FetchValuePromise<any>;
    } catch (err) {
        const result = Promise.reject(err) as ExecutionUtil.FetchValuePromise<any>;
        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.or = () => {
            //To avoid `unhandled rejection` warnings
            result.catch(() => {});
            return Promise.reject(err);
        };
        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.orUndefined = () => {
            //To avoid `unhandled rejection` warnings
            result.catch(() => {});
            return Promise.reject(err);
        };
        return result;
    }
}

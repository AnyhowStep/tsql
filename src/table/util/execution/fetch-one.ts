import {SelectConnection, ExecutionUtil} from "../../../execution";
import {WhereDelegate} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {Row} from "../../../row";
import {SelectClause, SelectDelegate} from "../../../select-clause";
import {QueryUtil} from "../../../unified-query";
import {ITable} from "../../table";

export function fetchOne<TableT extends ITable> (
    connection : SelectConnection,
    table : TableT,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >
) : ExecutionUtil.FetchOnePromise<Row<TableT>>;
export function fetchOne<
    TableT extends ITable,
    SelectsT extends SelectClause
> (
    connection : SelectConnection,
    table : TableT,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    selectDelegate : SelectDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >,
        undefined,
        SelectsT
    >
) : (
    ExecutionUtil.FetchOneReturnType<
        QueryUtil.Select<
            QueryUtil.From<
                QueryUtil.NewInstance,
                TableT
            >,
            SelectsT
        >
    >
);
export function fetchOne<
    TableT extends ITable
> (
    connection : SelectConnection,
    table : TableT,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    selectDelegate? : (...args : any[]) => any[]
) : ExecutionUtil.FetchOnePromise<any> {
    try {
        const query = QueryUtil.newInstance()
            .from<TableT>(
                table as (
                    TableT &
                    QueryUtil.AssertValidCurrentJoin<QueryUtil.NewInstance, TableT>
                )
            )
            .where(whereDelegate);
        if (selectDelegate == undefined) {
            return query
                .select(((columns : any) => [columns]) as any)
                .fetchOne(connection);
        } else {
            return query
                .select(selectDelegate as any)
                .fetchOne(connection);
        }
    } catch (err) {
        const result = Promise.reject(err) as ExecutionUtil.FetchOnePromise<any>;
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

export function __fetchOneHelper<
    TableT extends ITable
> (
    connection : SelectConnection,
    table : TableT,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >,
    selectDelegate? : (...args : any[]) => any[]
) : ExecutionUtil.FetchOnePromise<any> {
    if (selectDelegate == undefined) {
        return fetchOne(connection, table, whereDelegate);
    } else {
        return fetchOne(connection, table, whereDelegate, selectDelegate as any);
    }
}

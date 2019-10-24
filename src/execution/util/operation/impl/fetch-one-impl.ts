import {FetchAllConnection, FetchedRow} from "../../helper-type";
import {QueryBaseUtil} from "../../../../query-base";
import {trySetLimit2} from "./try-set-limit-2";
import {fetchAllImpl} from "./fetch-all-impl";
import {ensureOne} from "./ensure-one";
import {ensureOneOr} from "./ensure-one-or";

export interface FetchOneImplPromise<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
> extends Promise<{
    sql : string,
    row : FetchedRow<QueryT>,
}> {
    or<DefaultValueT> (defaultValue : DefaultValueT) : Promise<{
        sql : string,
        row : FetchedRow<QueryT>|DefaultValueT,
    }>;
    orUndefined () : Promise<{
        sql : string,
        row : FetchedRow<QueryT>|undefined,
    }>;
}
export function fetchOneImpl<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>
) : (
    FetchOneImplPromise<QueryT>
) {
    try {
        const limitedQuery = trySetLimit2(query);

        const p = fetchAllImpl<QueryT>(limitedQuery, connection);
        const result = p
            .then((fetched) => {
                return {
                    sql : fetched.sql,
                    row : ensureOne(limitedQuery, fetched),
                };
            }) as FetchOneImplPromise<QueryT>;

        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.or = <DefaultValueT>(defaultValue : DefaultValueT) : Promise<{
            sql : string,
            row : FetchedRow<QueryT>|DefaultValueT,
        }> => {
            //To avoid `unhandled rejection` warnings
            result.catch(() => {});
            return p
                .then((fetched) => {
                    return {
                        sql : fetched.sql,
                        row : ensureOneOr(limitedQuery, fetched, defaultValue),
                    };
                });
        };

        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.orUndefined = () : Promise<{
            sql : string,
            row : FetchedRow<QueryT>|undefined,
        }> => {
            return result.or(undefined);
        };

        return result;
    } catch (err) {
        const result = Promise.reject(err) as FetchOneImplPromise<QueryT>;
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

import {QueryBaseUtil} from "../../../../query-base";
import {SelectConnection} from "../../../connection";
import {trySetLimit2} from "./try-set-limit-2";
import {fetchValueArrayImpl} from "./fetch-value-array-impl";
import {ensureOne} from "./ensure-one";
import {ensureOneOr} from "./ensure-one-or";

export interface FetchValueImplPromise<
    QueryT extends QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.NonCorrelated
> extends Promise<{
    sql : string,
    value : QueryBaseUtil.TypeOfSelectItem<QueryT>,
}> {
    or<DefaultValueT> (defaultValue : DefaultValueT) : Promise<{
        sql : string,
        value : QueryBaseUtil.TypeOfSelectItem<QueryT>|DefaultValueT,
    }>;
    orUndefined () : Promise<{
        sql : string,
        value : QueryBaseUtil.TypeOfSelectItem<QueryT>|undefined,
    }>;
}
export function fetchValueImpl<
    QueryT extends QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : (
    FetchValueImplPromise<QueryT>
) {
    try {
        const limitedQuery = trySetLimit2(query);

        const p = fetchValueArrayImpl<QueryT>(limitedQuery, connection);
        const result = p
            .then((fetched) => {
                return {
                    sql : fetched.sql,
                    value : ensureOne(limitedQuery, fetched),
                };
            }) as FetchValueImplPromise<QueryT>;

        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.or = <DefaultValueT>(defaultValue : DefaultValueT) : Promise<{
            sql : string,
            value : QueryBaseUtil.TypeOfSelectItem<QueryT>|DefaultValueT,
        }> => {
            //To avoid `unhandled rejection` warnings
            result.catch(() => {});
            return p
                .then((fetched) => {
                    return {
                        sql : fetched.sql,
                        value : ensureOneOr(limitedQuery, fetched, defaultValue),
                    };
                });
        };

        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.orUndefined = () : Promise<{
            sql : string,
            value : QueryBaseUtil.TypeOfSelectItem<QueryT>|undefined,
        }> => {
            return result.or(undefined);
        };

        return result;
    } catch (err) {
        const result = Promise.reject(err) as FetchValueImplPromise<QueryT>;
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

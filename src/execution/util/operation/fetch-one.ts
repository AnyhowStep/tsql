import {FetchAllConnection, FetchedRow} from "../helper-type";
import {QueryBaseUtil} from "../../../query-base";
import {fetchOneImpl} from "./impl";

export interface FetchOnePromise<RowT> extends Promise<RowT> {
    or<DefaultValueT> (defaultValue : DefaultValueT) : Promise<RowT|DefaultValueT>;
    orUndefined () : Promise<RowT|undefined>;
}
export type FetchOneReturnType<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
> =
    FetchOnePromise<FetchedRow<QueryT>>
;
export function fetchOne<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>
) : FetchOneReturnType<QueryT> {
    try {
        const p = fetchOneImpl(query, connection);
        const result = p.then(({row}) => row) as FetchOneReturnType<QueryT>;

        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.or = <DefaultValueT>(defaultValue : DefaultValueT) : Promise<FetchedRow<QueryT>|DefaultValueT> => {
            //To avoid `unhandled rejection` warnings
            result.catch(() => {});

            return p.or(defaultValue).then(({row}) => row);
        };
        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.orUndefined = () : Promise<FetchedRow<QueryT>|undefined> => {
            return result
                .or(undefined);
        };
        return result;
    } catch (err) {
        const result = Promise.reject(err) as FetchOneReturnType<QueryT>;
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

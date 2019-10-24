import {QueryBaseUtil} from "../../../query-base";
import {SelectConnection} from "../../connection";
import {fetchValueImpl} from "./impl";

export interface FetchValuePromise<ValueT> extends Promise<ValueT> {
    or<DefaultValueT> (defaultValue : DefaultValueT) : Promise<ValueT|DefaultValueT>;
    orUndefined () : Promise<ValueT|undefined>;
}
export type FetchValueReturnType<
    QueryT extends QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.NonCorrelated
> =
    FetchValuePromise<QueryBaseUtil.TypeOfSelectItem<QueryT>>
;
export function fetchValue<
    QueryT extends QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : FetchValueReturnType<QueryT> {
    try {
        const p = fetchValueImpl(query, connection);
        const result = p.then(({value}) => value) as FetchValueReturnType<QueryT>;

        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.or = <DefaultValueT>(defaultValue : DefaultValueT) : Promise<QueryBaseUtil.TypeOfSelectItem<QueryT>|DefaultValueT> => {
            //To avoid `unhandled rejection` warnings
            result.catch(() => {});

            return p.or(defaultValue).then(({value}) => value);
        };
        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.orUndefined = () : Promise<QueryBaseUtil.TypeOfSelectItem<QueryT>|undefined> => {
            return result
                .or(undefined);
        };
        return result;
    } catch (err) {
        const result = Promise.reject(err) as FetchValueReturnType<QueryT>;
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

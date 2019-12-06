import {ITablePerType} from "../../table-per-type";
import {SelectConnection} from "../../../execution";
import {WhereDelegate} from "../../../where-clause";
import {Row} from "../query";
import {FetchOnePromise} from "../../../execution/util";
import {fetchOneImpl, From} from "../execution-impl";

/**
 * + Assumes `parentTables` has no duplicates.
 * + Assumes `childTable` is not in `parentTables`.
 * + Assumes any shared `columnAlias` between tables **must** have the same value.
 * + Assumes `joins` represents a valid inheritance graph.
 */
export function fetchOne<TptT extends ITablePerType> (
    tpt : TptT,
    connection : SelectConnection,
    whereDelegate : WhereDelegate<From<TptT>["fromClause"]>
) : FetchOnePromise<Row<TptT>> {
    try {
        const p = fetchOneImpl(tpt, connection, whereDelegate);
        const result = p.then(({row}) => row) as FetchOnePromise<Row<TptT>>;

        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.or = <DefaultValueT>(defaultValue : DefaultValueT) : Promise<Row<TptT>|DefaultValueT> => {
            //To avoid `unhandled rejection` warnings
            result.catch(() => {});

            return p.or(defaultValue).then(({row}) => row);
        };
        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.orUndefined = () : Promise<Row<TptT>|undefined> => {
            return result
                .or(undefined);
        };
        return result;
    } catch (err) {
        const result = Promise.reject(err) as FetchOnePromise<Row<TptT>>;
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

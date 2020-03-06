import {ITablePerType} from "../../table-per-type";
import {SelectConnection} from "../../../execution";
import {fetchOne} from "./fetch-one";
import {FetchOnePromise} from "../../../execution/util";
import {Row, SuperKey} from "../query";
import {eqSuperKey} from "../operation";

export function fetchOneBySuperKey<TptT extends ITablePerType> (
    tpt : TptT,
    connection : SelectConnection,
    superKey : SuperKey<TptT>
) : FetchOnePromise<Row<TptT>> {
    return fetchOne(
        tpt,
        connection,
        () => eqSuperKey(
            tpt,
            superKey
        ) as any
    );
}

import {ITablePerType} from "../../table-per-type";
import {SelectConnection} from "../../../execution";
import * as ExprLib from "../../../expr-library";
import {PrimaryKey_Input} from "../../../primary-key";
import {fetchOne} from "./fetch-one";
import {FetchOnePromise} from "../../../execution/util";
import {Row} from "../query";

export function fetchOneByPrimaryKey<TptT extends ITablePerType> (
    tpt : TptT,
    connection : SelectConnection,
    primaryKey : PrimaryKey_Input<TptT["childTable"]>
) : FetchOnePromise<Row<TptT>> {
    return fetchOne(
        tpt,
        connection,
        () => ExprLib.eqPrimaryKey(
            tpt.childTable,
            primaryKey as any
        )
    );
}

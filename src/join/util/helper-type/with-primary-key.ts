import {IJoin} from "../../join";
import {ColumnMap} from "../../../column-map";
import {Key} from "../../../key";

export interface WithPrimaryKey extends IJoin<{
    tableAlias : string,
    nullable : boolean,
    columns : ColumnMap,

    originalColumns : ColumnMap,

    primaryKey : Key;

    candidateKeys : readonly Key[];

    deleteEnabled : boolean,

    mutableColumns : readonly string[];
}> {

}

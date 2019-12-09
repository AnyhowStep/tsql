import {ITablePerType} from "../../table-per-type";
import {isObjectWithOwnEnumerableKeys} from "../../../type-util";
import {TableUtil} from "../../../table";

/**
 * Actually only checks if it has all the properties of `ITablePerType`.
 *
 * So, if it has all the properties but they're of the wrong data type...
 */
export function isTablePerType (mixed : unknown) : mixed is ITablePerType {
    if (!isObjectWithOwnEnumerableKeys<ITablePerType>()(
        mixed,
        [
            "childTable",
            "parentTables",
            "autoIncrement",
            "explicitAutoIncrementValueEnabled",
            "joins"
        ]
    )) {
        return false;
    }
    return (
        TableUtil.isTable(mixed.childTable) &&
        /**
         * Does not check if all elements are `ITable`
         */
        (mixed.parentTables instanceof Array) &&
        /**
         * Does not check if all elements are `string`
         */
        (mixed.autoIncrement instanceof Array) &&
        /**
         * Does not check if all elements are `string`
         */
        (mixed.explicitAutoIncrementValueEnabled instanceof Array) &&
        /**
         * Does not check if all elements are `string`
         */
        (mixed.joins instanceof Array)
    );
}

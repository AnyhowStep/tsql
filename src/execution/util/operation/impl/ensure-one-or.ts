import {IQueryBase} from "../../../../query-base";
import {TooManyRowsFoundError} from "../../../../error";

/**
 * @todo Better naming
 */
export function ensureOneOr<
    ResultSetT extends any[],
    DefaultValueT
> (
    query : Pick<IQueryBase, "fromClause">,
    fetched : {
        sql : string,
        resultSet : ResultSetT,
    },
    defaultValue : DefaultValueT
) : (
    ResultSetT[number] | DefaultValueT
) {
    const resultSet = fetched.resultSet;
    if (resultSet.length == 0) {
        return defaultValue;
    } else if (resultSet.length == 1) {
        return resultSet[0];
    } else {
        if (query.fromClause.currentJoins == undefined || query.fromClause.currentJoins.length == 0) {
            throw new TooManyRowsFoundError(`Expected zero or one row, found more than that`, fetched.sql);
        } else {
            throw new TooManyRowsFoundError(`Expected zero or one row from ${query.fromClause.currentJoins[0].tableAlias}, found more than that`, fetched.sql);
        }
    }
}

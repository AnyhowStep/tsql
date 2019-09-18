import {IQueryBase} from "../../../../query-base";
import {TooManyRowsFoundError, RowNotFoundError} from "../../../../error";

/**
 * @todo Better naming
 */
export function ensureOne<
    ResultSetT extends any[]
> (
    query : Pick<IQueryBase, "fromClause">,
    fetched : {
        sql : string,
        resultSet : ResultSetT,
    }
) : (
    ResultSetT[number]
) {
    const resultSet = fetched.resultSet;
    if (resultSet.length == 0) {
        if (query.fromClause.currentJoins == undefined || query.fromClause.currentJoins.length == 0) {
            throw new RowNotFoundError(`Expected one row, found zero`, fetched.sql);
        } else {
            throw new RowNotFoundError(`Expected one row from ${query.fromClause.currentJoins[0].tableAlias}, found zero`, fetched.sql);
        }
    } else if (resultSet.length == 1) {
        return resultSet[0];
    } else {
        if (query.fromClause.currentJoins == undefined || query.fromClause.currentJoins.length == 0) {
            throw new TooManyRowsFoundError(`Expected one row, found more than that`, fetched.sql);
        } else {
            throw new TooManyRowsFoundError(`Expected one row from ${query.fromClause.currentJoins[0].tableAlias}, found more than that`, fetched.sql);
        }
    }
}

import {ITablePerType} from "../../table-per-type";
import * as ExecutionImpl from "../../../execution/util/operation/impl";
import {SelectConnection} from "../../../execution";
import {WhereDelegate} from "../../../where-clause";
import {QueryUtil} from "../../../unified-query";
import {Row, columnAliases, extractAllTablesWithColumnAlias} from "../query";
import {from, From} from "./from";
import {DataTypeUtil} from "../../../data-type";

function cleanFetchedRow (
    tpt : ITablePerType,
    rawRow : Record<string, Record<string, unknown>>
) : Record<string, unknown> {
    const cleanRow : any = {};
    for (const columnAlias of columnAliases(tpt)) {
        const tables = extractAllTablesWithColumnAlias(
            tpt,
            columnAlias
        );
        for(let i=0; i<tables.length; ++i) {
            const table = tables[i];
            const value = rawRow[table.alias][columnAlias];
            for (let j=i+1; j<tables.length; ++j) {
                const otherTable = tables[j];
                const otherValue = rawRow[otherTable.alias][columnAlias];

                if (!DataTypeUtil.isNullSafeEqual(
                    table.columns[columnAlias],
                    value,
                    /**
                     * This may throw
                     */
                    table.columns[columnAlias].mapper(
                        `(${otherTable.alias}->${table.alias}).${columnAlias}`,
                        otherValue
                    )
                )) {
                    /**
                     * @todo Custom Error type
                     */
                    throw new Error(`Expected ${table.alias}.${columnAlias} and ${otherTable.alias}.${columnAlias} to have the same value`);
                }

                if (!DataTypeUtil.isNullSafeEqual(
                    otherTable.columns[columnAlias],
                    otherValue,
                    /**
                     * This may throw
                     */
                    otherTable.columns[columnAlias].mapper(
                        `(${table.alias}->${otherTable.alias}).${columnAlias}`,
                        value
                    )
                )) {
                    /**
                     * @todo Custom Error type
                     */
                    throw new Error(`Expected ${otherTable.alias}.${columnAlias} and ${table.alias}.${columnAlias} to have the same value`);
                }
            }
        }
        //If we are here, then it doesn't matter which value of `columnAlias` we use.
        cleanRow[columnAlias] = rawRow[tables[0].alias][columnAlias];
    }
    return cleanRow;
}

/**
 * + Assumes `parentTables` has no duplicates.
 * + Assumes `childTable` is not in `parentTables`.
 * + Assumes any shared `columnAlias` between tables **must** have the same value.
 * + Assumes `joins` represents a valid inheritance graph.
 */
export function fetchOneImpl<TptT extends ITablePerType> (
    tpt : TptT,
    connection : SelectConnection,
    whereDelegate : WhereDelegate<From<TptT>["fromClause"]>
) : ExecutionImpl.FetchOneImplPromise<Row<TptT>> {
    try {
        if (tpt.parentTables.length == 0) {
            return ExecutionImpl.fetchOneImpl(
                QueryUtil.newInstance()
                    .from(tpt.childTable as any)
                    .where(whereDelegate as any)
                    .select(columns => [columns] as any) as any,
                connection
            ) as ExecutionImpl.FetchOneImplPromise<Row<TptT>>;
        }

        const query = from(tpt)
            .where(whereDelegate as any)
            .select(columns => [columns] as any) as any;

        const limitedQuery = ExecutionImpl.trySetLimit2(query);

        const fetchLimit2Promise = ExecutionImpl.fetchAllImpl(
            limitedQuery,
            connection
        ) as Promise<{
            sql : string,
            resultSet : Row<TptT>[],
        }>;

        const result = fetchLimit2Promise.then((fetched) : {
            sql : string,
            row : Row<TptT>,
        } => {
            const rawRow = ExecutionImpl.ensureOne(
                limitedQuery,
                fetched
            ) as Record<string, Record<string, unknown>>;
            return {
                sql : fetched.sql,
                row : cleanFetchedRow(tpt, rawRow) as Row<TptT>,
            };
        }) as ExecutionImpl.FetchOneImplPromise<Row<TptT>>;
        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.or = <DefaultValueT>(defaultValue : DefaultValueT) : Promise<{
            sql : string,
            row : Row<TptT>|DefaultValueT,
        }> => {
            //To avoid `unhandled rejection` warnings
            result.catch(() => {});
            return fetchLimit2Promise
                .then((fetched) => {
                    const rawRowOrDefaultValue = ExecutionImpl.ensureOneOr(
                        limitedQuery,
                        fetched,
                        defaultValue
                    );
                    return {
                        sql : fetched.sql,
                        row : (
                            rawRowOrDefaultValue === defaultValue ?
                            defaultValue :
                            cleanFetchedRow(tpt, rawRowOrDefaultValue as any)
                        ) as DefaultValueT|Row<TptT>,
                    };
                });
        };

        //eslint-disable-next-line @typescript-eslint/unbound-method
        result.orUndefined = () : Promise<{
            sql : string,
            row : Row<TptT>|undefined,
        }> => {
            return result.or(undefined);
        };

        return result;
    } catch (err) {
        const result = Promise.reject(err) as ExecutionImpl.FetchOneImplPromise<Row<TptT>>;
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

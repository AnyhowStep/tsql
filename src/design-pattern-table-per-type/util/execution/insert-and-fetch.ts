import {InsertableTablePerType} from "../../table-per-type";
import {CustomInsertRowWithPrimaryKey} from "./insert-row";
import {IsolableInsertOneConnection, ExecutionUtil} from "../../../execution";
import {Identity, OnlyKnownProperties, omitOwnEnumerable} from "../../../type-util";
import {ColumnAlias, ColumnType, implicitAutoIncrement, generatedColumnAliases, findTableWithGeneratedColumnAlias} from "../query";
import {CustomExprUtil} from "../../../custom-expr";
import {TableUtil} from "../../../table";
import {expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";
import {absorbRow} from "../execution-impl";
import {IsolationLevel} from "../../../isolation-level";

export type InsertAndFetchRow<
    TptT extends InsertableTablePerType
> =
    CustomInsertRowWithPrimaryKey<TptT>
;

export type InsertedAndFetchedRow<
    TptT extends InsertableTablePerType,
    RowT extends InsertAndFetchRow<TptT>
> =
    Identity<{
        readonly [columnAlias in ColumnAlias<TptT>] : (
            columnAlias extends keyof RowT ?
            (
                undefined extends RowT[columnAlias] ?
                ColumnType<TptT, columnAlias> :
                CustomExprUtil.TypeOf<
                    RowT[columnAlias]
                >
            ) :
            ColumnType<TptT, columnAlias>
        )
    }>
;

/**
 * Assumes there are no duplicate `parentTables`.
 *
 * `.addParent()` should remove duplicates.
 */
export async function insertAndFetch<
    TptT extends InsertableTablePerType,
    RowT extends InsertAndFetchRow<TptT>
> (
    tpt : TptT,
    connection : IsolableInsertOneConnection,
    insertRow : OnlyKnownProperties<RowT, InsertAndFetchRow<TptT>>
) : (
    Promise<InsertedAndFetchedRow<TptT, RowT>>
) {
    /**
     * @todo Add `assertInsertable()` or something
     */
    return connection.transactionIfNotInOne(IsolationLevel.REPEATABLE_READ, async (connection) : Promise<InsertedAndFetchedRow<TptT, RowT>> => {
        return connection.savepoint(async (connection) : Promise<InsertedAndFetchedRow<TptT, RowT>> => {
            const generated = generatedColumnAliases(tpt);

            const result : any = omitOwnEnumerable(
                insertRow,
                [
                    /**
                     * We omit implicit auto-increment values because we do not
                     * want them to be set by users of the library.
                     */
                    ...implicitAutoIncrement(tpt),
                    /**
                     * We omit generated values because users can't set them, anyway.
                     */
                    ...generated,
                ] as any
            );

            for(const columnAlias of generated) {
                const table = findTableWithGeneratedColumnAlias(
                    tpt,
                    columnAlias
                );

                const sqlString = await connection.tryFetchGeneratedColumnExpression(
                    TableUtil.tryGetSchemaName(table),
                    table.alias,
                    columnAlias
                );

                if (sqlString == undefined) {
                    throw new Error(`Generated column ${table.alias}.${columnAlias} should have generation expression`);
                }

                result[columnAlias] = expr(
                    {
                        mapper : table.columns[columnAlias].mapper,
                        usedRef : UsedRefUtil.fromColumnRef({}),
                        /**
                         * `GENERATED` columns should not have aggregate expressions.
                         */
                        isAggregate : false,
                    },
                    /**
                     * This `sqlString` is not allowed to reference any columns.
                     * If it does, there is a very high chance that it will cause an error.
                     *
                     * @todo Find use case where we need to allow this to reference columns.
                     */
                    sqlString
                );
            }

            for(const table of [...tpt.parentTables, tpt.childTable]) {
                const fetchedRow = await ExecutionUtil.insertAndFetch(
                    /**
                     * We use `InsertAndFetchOptions`, instead of creating
                     * a new table instance because we want events to use the
                     * original `table` instance.
                     *
                     * `event.isFor()` methods use `===` internally
                     */
                    table,
                    connection,
                    result as never,
                    {
                        /**
                         * We want to allow explicit auto-increment values internally,
                         * so that the same value is used for all tables of the same
                         * inheritance hierarchy.
                         */
                        explicitAutoIncrementValueEnabled : true,
                    }
                );
                absorbRow(result, table, fetchedRow);
            }

            return result;
        });
    });
}

import * as tm from "type-mapping";
/**
 * We use `BIGINT SIGNED` because PostgreSQL and SQLite do not support
 * `BIGINT UNSIGNED`.
 */
const maybePage = tm.mysql.bigIntSigned().orUndefined();
const maybeRowsPerPage = tm.mysql.bigIntSigned().orUndefined();
const maybeRowOffset = tm.mysql.bigIntSigned().orUndefined();

/**
 * Better to use `bigint`.
 *
 * `9223372036854775807n` cannot be represented using a `double`.
 *
 * It gets rounded to `9223372036854776000`
 */
export interface RawPaginateArgs {
    page? : number|bigint,
    rowsPerPage? : number|bigint,
    /**
     * When positive, lets you skip the first `rowOffset` rows.
     * Has no effect when negative or zero.
     */
    rowOffset? : number|bigint,
}
export interface PaginateArgs {
    page : bigint,
    rowsPerPage : bigint,
    rowOffset : bigint,
}

export function toPaginateArgs (rawArgs : RawPaginateArgs) : PaginateArgs {
    const page = maybePage.mapMappable("page", rawArgs.page);
    const rowsPerPage = maybeRowsPerPage.mapMappable("rowsPerPage", rawArgs.rowsPerPage);
    const rowOffset = maybeRowOffset.mapMappable("rowOffset", rawArgs.rowOffset);

    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

    const args = {
        page : (page == undefined || tm.BigIntUtil.lessThan(page,  0)) ?
            //Default
            BigInt(0) :
            page,
        rowsPerPage : (rowsPerPage == undefined || tm.BigIntUtil.lessThan(rowsPerPage, 1)) ?
            //Default
            BigInt(20) :
            rowsPerPage,
        rowOffset : (rowOffset == undefined || tm.BigIntUtil.lessThan(rowOffset, 0)) ?
            //Default
            BigInt(0) :
            rowOffset,
    };
    const paginationStart = getPaginationStart(args);
    if (tm.BigIntUtil.greaterThan(paginationStart, BigInt("9223372036854775807"))) {
        throw new Error(`Cannot have OFFSET greater than 9223372036854775807`);
    }

    return args;
}

/**
 * It is possible for this value to be greater than
 * `9223372036854775807n`.
 *
 * When this happens, you will get an error from the RDBMS
 */
export function getPaginationStart (args : PaginateArgs) : bigint {
    return tm.BigIntUtil.add(
        tm.BigIntUtil.mul(
            args.page,
            args.rowsPerPage
        ),
        args.rowOffset
    );
}

export function calculatePagesFound (args : PaginateArgs, rowsFound : bigint) : bigint {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

    if (tm.BigIntUtil.lessThan(rowsFound, 0)) {
        /**
         * Should not have negative rows found
         */
        return BigInt(0);
    }
    if (tm.BigIntUtil.lessThanOrEqual(args.rowsPerPage, 0)) {
        /**
         * Avoid divide by zero errors
         */
        return BigInt(0);
    }
    return (
        tm.BigIntUtil.add(
            tm.BigIntUtil.div(rowsFound, args.rowsPerPage),
            (
                tm.BigIntUtil.equal(tm.BigIntUtil.mod(rowsFound, args.rowsPerPage), BigInt(0)) ?
                    BigInt(0) :
                    BigInt(1)
            )
        )
    );
}

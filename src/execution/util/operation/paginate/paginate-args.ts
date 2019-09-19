import * as tm from "type-mapping";
const maybePage = tm.mysql.bigIntUnsigned().orUndefined();
const maybeRowsPerPage = tm.mysql.bigIntUnsigned().orUndefined();

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
}
export interface PaginateArgs {
    page : bigint,
    rowsPerPage : bigint,
}

export function toPaginateArgs (rawArgs : RawPaginateArgs) : PaginateArgs {
    const page = maybePage.mapMappable("page", rawArgs.page);
    const rowsPerPage = maybeRowsPerPage.mapMappable("rowsPerPage", rawArgs.rowsPerPage);

    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

    return {
        page : (page == undefined || page <  0) ?
            //Default
            BigInt(0) :
            page,
        rowsPerPage : (rowsPerPage == undefined || rowsPerPage < 1) ?
            //Default
            BigInt(20) :
            rowsPerPage,
    };
}

export function getPaginationStart (args : PaginateArgs) : bigint {
    return args.page * args.rowsPerPage;
}

export function calculatePagesFound (args : PaginateArgs, rowsFound : bigint) : bigint {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

    if (rowsFound < 0) {
        /**
         * Should not have negative rows found
         */
        return BigInt(0);
    }
    if (args.rowsPerPage <= 0) {
        /**
         * Avoid divide by zero errors
         */
        return BigInt(0);
    }
    return (
        rowsFound/args.rowsPerPage +
        (
            (rowsFound%args.rowsPerPage == BigInt(0)) ?
                BigInt(0) :
                BigInt(1)
        )
    );
}

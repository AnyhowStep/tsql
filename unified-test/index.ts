import * as tsql from "../dist";
import {getAllTsFiles} from "./util";

/**
 * @todo More properties like default values, generated values, auto increment, etc.
 */
export interface UnifiedColumn {
    readonly columnAlias : string;
    readonly dataType : (
        | {
            readonly typeHint : Exclude<
                tsql.TypeHint,
                | tsql.TypeHint.NULL
                | tsql.TypeHint.BUFFER
                | tsql.TypeHint.DATE_TIME
                | tsql.TypeHint.DECIMAL
                | tsql.TypeHint.STRING
            >
        }
        | {
            readonly typeHint : tsql.TypeHint.BUFFER,
        }
        | {
            readonly typeHint : tsql.TypeHint.DATE_TIME,
        }
        | {
            readonly typeHint : tsql.TypeHint.DECIMAL,
            readonly precision : number,
            readonly scale : number,
        }
        | {
            readonly typeHint : tsql.TypeHint.STRING,
        }
    );
    /**
     * @default false
     */
    readonly nullable? : boolean;

    readonly default? : tsql.AnyBuiltInExpr;
}
export interface UnifiedTable {
    readonly tableAlias : string;
    readonly columns : readonly UnifiedColumn[];

    readonly primaryKey? : (
        | undefined
        | {
            readonly multiColumn : true;
            readonly columnAliases : readonly string[];
        }
        | {
            readonly multiColumn : false;
            readonly columnAlias : string;
            readonly autoIncrement : boolean;
        }
    );

    readonly candidateKeys? : readonly (readonly string[])[];
}
export interface UnifiedSchema {
    readonly tables : readonly UnifiedTable[];
}

export function unifiedTest (
    {
        tape,
        pool,
        createTemporarySchema,
        fileNameLike,
    } :
    {
        tape : typeof import("tape"),
        pool : tsql.IPool,
        createTemporarySchema : (
            connection : tsql.IConnection,
            schema : UnifiedSchema
        ) => Promise<void>,
        fileNameLike : string|undefined,
    }
) {
    const tsFiles = getAllTsFiles(
        `${__dirname}/input`,
        false
    );
    for (const tsFile of tsFiles) {
        if (fileNameLike != undefined && !tsFile.includes(fileNameLike)) {
            continue;
        }
        const required = require(tsFile);
        if (required.test == undefined) {
            continue;
        }
        console.log(tsFile);
        required.test({tape, pool, createTemporarySchema});
    }

    tape("pool.disconnect()", async (t) => {

        t.end();
    });
}

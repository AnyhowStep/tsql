import * as tsql from "../dist";
import {getAllTsFiles} from "./util";
import * as fs from "fs";

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
    const paths = getAllTsFiles(
        `${__dirname}/input`,
        false
    );
    const imports = paths
        .filter(path => {
            if (fileNameLike != undefined && !path.includes(fileNameLike)) {
                return false;
            }
            return /export\s+const\s+test/.test(fs.readFileSync(path).toString());
        });
    /**
     * Contains generated code that, when run,
     * will import all the run-time tests.
     */
    const runTimeTestImportsGeneratedCode = imports
        .map((path, index) => {
            path = JSON.stringify(
                path
                    .replace(/\.ts$/, "")
                    .replace(__dirname, ".")
            );
            return `
import {test as test${index+1}} from ${path};
console.log(${index+1}, "/",${imports.length}, ${path});
`;
        })
        .join("");
    const runTimeTestFunctionCallsGeneratedCode = imports
        .map((_path, index) => {
            return `test${index+1}(args);`;
        })
        .join("\n    ");


    /**
     * Write the generated code to a file,
     * and then import that file.
     */
    const runTimeTestImportsPath = __dirname + "/test-imports.ts";
    fs.writeFileSync(
        runTimeTestImportsPath,
        runTimeTestImportsGeneratedCode + `
import {Test} from "./test";
export const testAll : Test = (args) => {
    ${runTimeTestFunctionCallsGeneratedCode}
};
`
    );
    require(runTimeTestImportsPath).testAll({tape, pool, createTemporarySchema});


    tape("pool.disconnect()", async (t) => {
        await pool.disconnect();
        t.end();
    });
}

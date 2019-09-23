/**
 * Before, this runner would do the following,
 * ```ts
 *  const paths = getAllTsFiles();
 *  for (const path of paths) {
 *      require(path);
 *  }
 * ```
 *
 * This would take 150+s to load 400+ files, and run 10,000+ tests.
 *
 * -----
 *
 * This new approach is faster,
 * ```ts
 *  const paths = getAllTsFiles();
 *  const generatedCode = generateCode(paths);
 *  fs.writeFileSync(generatedPath, generatedCode);
 *  require(generatedPath);
 * ```
 *
 * It now takes 25+s. About a 6x speed up.
 */
import {getAllTsFiles} from "./util";
import * as tape from "tape";
import * as fs from "fs";

const start = new Date().getTime();
const paths = getAllTsFiles(__dirname + "/input", false);

/**
 * Contains generated code that, when run,
 * will import all the run-time tests.
 */
const runTimeTestImportsGeneratedCode = paths.map((path, index) => {
    path = JSON.stringify(
        path
            .replace(/\.ts$/, "")
            .replace(__dirname, ".")
    );
    return `import ${path};\nconsole.log(${index+1}, "/",${paths.length}, ${path});`;
}).join("\n");

/**
 * Write the generated code to a file,
 * and then import that file.
 */
const runTimeTestImportsPath = __dirname + "/run-time-test-imports.ts";
fs.writeFileSync(
    runTimeTestImportsPath,
    runTimeTestImportsGeneratedCode
);
require(runTimeTestImportsPath);

tape(__filename, async (t) => {
    const end = new Date().getTime();
    const timeTaken = end-start;
    console.log("Run-time tests completed in", timeTaken/1000.0, "s");
    t.end();
});

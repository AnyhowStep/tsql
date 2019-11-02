import {runTest} from "./util";

const start = new Date().getTime();
/**
 * https://github.com/microsoft/TypeScript/issues/26238#issuecomment-549018426
 */
const {
    rootNames,
    allDiffResults
} = runTest(true);
const end = new Date().getTime();
const timeTaken = end-start;

console.log("Compile-time tests completed in", timeTaken/1000.0, "s");
if (allDiffResults.length > 0) {
    for (const diffResult of allDiffResults) {
        console.log("====================================");
        console.error(JSON.stringify(diffResult, null, 2));
    }
    for (const diffResult of allDiffResults) {
        console.log(diffResult.relativePath);
    }
    console.error("Found discrepancies in", allDiffResults.length, "out of", rootNames.length,"files");
    process.exit(1);
}
console.log("tested", rootNames.length, "files");

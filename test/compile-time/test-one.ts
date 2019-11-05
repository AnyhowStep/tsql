import {runTest} from "./util";
import * as path from "path";

const args = process.argv.slice(2).map(
    file => path.resolve(process.cwd() + "/" + file)
);
if (args.length == 0) {
    console.error("Nothing to test");
    process.exit(1);
}
console.log("testing", args);
const start = new Date().getTime();
const {
    rootNames,
    allDiffResults
} = runTest(false, args);
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

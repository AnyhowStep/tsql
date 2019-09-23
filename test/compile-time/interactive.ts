import {runTest} from "./util";
import {
    actualOutputRoot,
    expectedOutputRoot,
    copyFileSync,
} from "./util";
import * as nodeUtil from "util";
import * as path from "path";

const args = process.argv.slice(2).map(
    file => path.resolve(process.cwd() + "/" + file)
);

const {
    allDiffResults
} = runTest(
    args.length == 0 ?
    undefined :
    args
);
console.log(allDiffResults.length, "errors found");

const stdin = process.openStdin();
function tryShowNextDiff () {
    const curDiff = allDiffResults.shift();
    if (curDiff == undefined) {
        console.log("No more diffs to process");
        stdin.removeAllListeners();
        return;
    }
    console.log(nodeUtil.inspect(curDiff, {
        showHidden : false,
        depth : 999999,
        colors : true,
        maxArrayLength : 999999,
    }));
    console.log("== Declaration Diff ==");
    for (const d of curDiff.declarationDiffs) {
        const added = (d.added === true);
        const lines = d.value.split("\n");
        for (const line of lines) {
            console.log(
                added ? "+" : "-",
                line
            );
        }
    }
    console.log("== End Declaration Diff ==");
    console.log("== Error Diff ==");
    for (const d of curDiff.errorDiffs) {
        const added = (d.added === true);
        const lines = d.value.split("\n");
        for (const line of lines) {
            console.log(
                added ? "+" : "-",
                line
            );
        }
    }
    console.log("== End Error Diff ==");
    console.log(allDiffResults.length, "errors remaining");
    console.log("'accept' to accept");
    console.log("'s' to skip");
    stdin.addListener("data", (d) => {
        const command : string = d.toString().trim();
        if (command == "s") {
            stdin.removeAllListeners();
            process.nextTick(tryShowNextDiff);
        } else if (command == "accept") {
            stdin.removeAllListeners();
            copyFileSync(actualOutputRoot, expectedOutputRoot, curDiff.relativePath + ".d.ts");
            process.nextTick(tryShowNextDiff);
        } else {
            console.log("'accept' to accept");
            console.log("'s' to skip");
        }
    });
}

tryShowNextDiff();

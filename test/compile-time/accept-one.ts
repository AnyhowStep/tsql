import {
    actualOutputRoot,
    expectedOutputRoot,
    //removeAllFilesAndDirectoriesSync,
    copyFileSync,
} from "./util";

const args = process.argv.slice(2);
if (args.length == 0) {
    console.error("Nothing to accept");
    process.exit(1);
}

for (let relativePath of args) {
    if (!relativePath.startsWith("/")) {
        relativePath = "/" + relativePath;
    }
    copyFileSync(actualOutputRoot, expectedOutputRoot, relativePath + ".d.ts");
}

import * as fs from "fs";
import {
    actualOutputRoot,
    expectedOutputRoot,
    removeAllFilesAndDirectoriesSync,
    copyAllFilesAndDirectoriesSync,
} from "./util";

if (fs.readdirSync(actualOutputRoot).length == 0) {
    throw new Error(`No files in actual output, have you run the test?`);
}

removeAllFilesAndDirectoriesSync(expectedOutputRoot);
copyAllFilesAndDirectoriesSync(
    actualOutputRoot,
    expectedOutputRoot,
);
removeAllFilesAndDirectoriesSync(actualOutputRoot);
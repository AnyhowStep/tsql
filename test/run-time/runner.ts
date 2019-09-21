import {getAllTsFiles} from "./util";
import * as tape from "tape";

const start = new Date().getTime();
const paths = getAllTsFiles(__dirname + "/input", false);
const startIndex = 0;
const endIndex = paths.length;
for (let i=startIndex; i<endIndex; ++i) {
    const path = paths[i];
    console.log("path", i, "/", paths.length, path);
    require(path);
}
tape(__filename, async (t) => {
    const end = new Date().getTime();
    const timeTaken = end-start;
    console.log("Run-time tests completed in", timeTaken/1000.0, "s");
    t.end();
});

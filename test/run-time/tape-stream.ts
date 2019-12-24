import * as tape from "tape";

let assertCount = 0;
let failCount = 0;
let lastTestName = "";
tape.createStream({ objectMode : true }).on("data", (row) => {
    if (row.type == "test") {
        lastTestName = row.name;
    }
    if (row.ok === false) {
        if (row.name !== "test exited without ending") {
            console.error(row);
        }
        ++failCount;
    }
    if (row.type === "assert") {
        ++assertCount;
    }
}).on("close", () => {
    console.log(assertCount, "assertions");
    console.log(failCount, "failures");
});

process.on("unhandledRejection", (err) => {
    console.error(`Unhandled error in ${lastTestName}`, err);
});

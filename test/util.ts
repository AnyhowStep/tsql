import * as fs from "fs";
import * as util from "util";

export function getAllTsFiles (rootDir : string, result : string[] = [], relativeDir : string|undefined = undefined) : string[] {
    const currentDir = (relativeDir == undefined) ?
        rootDir :
        rootDir + "/" + relativeDir;
    for (const path of fs.readdirSync(currentDir)) {
        const fullPath = currentDir + "/" + path;
        if (fs.lstatSync(fullPath).isDirectory()) {
            getAllTsFiles(
                rootDir,
                result,
                (relativeDir == undefined) ?
                    path :
                    relativeDir + "/" + path
            );
        } else if (path.endsWith(".ts")) {
            if (relativeDir == undefined) {
                continue;
            }
            result.push(currentDir + "/" + path);
        }
    }
    return result;
}

export function log (...args : any[]) {
    const result : string[] = [];
    for (const arg of args) {
        result.push(util.inspect(
            arg,
            {
                depth : 10,
                colors : true,
                maxArrayLength : 100,
            }
        ));
    }
    console.log(result.join(", "));
}

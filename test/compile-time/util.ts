import * as ts from "typescript";
import * as fs from "fs";
import * as diff from "diff";

import {getAllTsFiles} from "../util";
export {getAllTsFiles};

export const inputRoot = __dirname + "/input";
export const actualOutputRoot = __dirname + "/actual-output";
export const expectedOutputRoot = __dirname + "/expected-output";


export function getAllFilesAndDirectories (rootDir : string, result : { path : string, isDir : boolean }[] = [], relativeDir : string|undefined = undefined) : { path : string, isDir : boolean }[] {
    const currentDir = (relativeDir == undefined) ?
        rootDir :
        rootDir + "/" + relativeDir;
    for (const path of fs.readdirSync(currentDir)) {
        const fullPath = currentDir + "/" + path;

        if (fs.lstatSync(fullPath).isDirectory()) {
            result.push({
                path : fullPath,
                isDir : true,
            });
            getAllFilesAndDirectories(
                rootDir,
                result,
                (relativeDir == undefined) ?
                    path :
                    relativeDir + "/" + path
            );
        } else {
            result.push({
                path : fullPath,
                isDir : false,
            });
        }
    }
    return result;
}

export function removeAllFilesAndDirectoriesSync (rootDir : string) {
    const paths = getAllFilesAndDirectories(rootDir).reverse();
    for (const path of paths) {
        if (path.isDir) {
            fs.rmdirSync(path.path);
        } else {
            fs.unlinkSync(path.path);
        }
    }
}

export function makeDirectorySync (rootDir : string, relativePath : string, relativePathIsFile : boolean) {
    //Ensure the directory exists
    const parts = relativePath.substr(1).split("/");
    if (relativePathIsFile) {
        parts.pop();
    }

    let curPath = rootDir;
    for (const p of parts) {
        curPath += "/" + p;
        if (!fs.existsSync(curPath)) {
            fs.mkdirSync(curPath);
        }
    }
}

export function copyFileSync (fromRootDir : string, toRootDir : string, relativePath : string) {
    makeDirectorySync(toRootDir, relativePath, true);

    const path = fromRootDir + relativePath;
    {
        const data = fs.readFileSync(path);
        fs.writeFileSync(
            toRootDir + relativePath,
            data
        );
    }
    if (fs.existsSync(path.replace(".d.ts", ".ts.errors"))) {
        const data = fs.readFileSync(path.replace(".d.ts", ".ts.errors"));
        fs.writeFileSync(
            toRootDir + relativePath.replace(".d.ts", ".ts.errors"),
            data
        );
    }
}
export function copyAllFilesAndDirectoriesSync (fromRootDir : string, toRootDir : string) {
    const paths = getAllTsFiles(fromRootDir);
    for (const path of paths) {
        const relativePath = path.substr(fromRootDir.length);
        makeDirectorySync(toRootDir, relativePath, true);

        {
            const data = fs.readFileSync(path);
            fs.writeFileSync(
                toRootDir + relativePath,
                data
            );
        }
        if (fs.existsSync(path.replace(".d.ts", ".ts.errors"))) {
            const data = fs.readFileSync(path.replace(".d.ts", ".ts.errors"));
            fs.writeFileSync(
                toRootDir + relativePath.replace(".d.ts", ".ts.errors"),
                data
            );
        }
    }
}

export function runTest () {
    removeAllFilesAndDirectoriesSync(actualOutputRoot);

    const rootNames = getAllTsFiles(inputRoot);
    const compilerOptions : ts.CompilerOptions = {
        strict : true,
        target : ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        declaration : true,
        emitDeclarationOnly : true,
    };
    const program = ts.createProgram({
        rootNames : rootNames,
        options : compilerOptions,
    });
    const emitResult = program.emit(
        undefined,
        (fileName, data) => {
            if (!fileName.startsWith(inputRoot)) {
                return;
            }
            const relativePath = fileName.substr(inputRoot.length);

            //Ensure the directory exists
            const parts = relativePath.substr(1).split("/");
            parts.pop();

            let curPath = actualOutputRoot;
            for (const p of parts) {
                curPath += "/" + p;
                if (!fs.existsSync(curPath)) {
                    fs.mkdirSync(curPath);
                }
            }

            //Write the declaration file
            fs.writeFileSync(
                actualOutputRoot + relativePath,
                data
            );
        }
    );
    const allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

    const errorDict : {
        [path : string] : undefined|{
            messageText : string|ts.DiagnosticMessageChain,
            category : ts.DiagnosticCategory,
            code : number,
            length : number|undefined,
            start : number|undefined,
        }[]
    } = {};
    for (const d of allDiagnostics) {
        if (d.file == undefined) {
            console.error(d);
            throw new Error(`Unexpected diagnostic error`);
        }
        if (!d.file.fileName.startsWith(inputRoot)) {
            continue;
        }
        const fileName = d.file.fileName.substr(inputRoot.length);

        let errors = errorDict[fileName];
        if (errors == undefined) {
            errors = [];
            errorDict[fileName] = errors;
        }

        const {
            messageText,
            code,
            category,
            length,
            start,
        } = d;
        errors.push({
            messageText,
            code,
            category,
            length,
            start,
        });
    }
    Object.keys(errorDict).forEach((fileName) => {
        fs.writeFileSync(
            actualOutputRoot + "/" + fileName + ".errors",
            JSON.stringify(errorDict[fileName], null, 2)
        );
    });

    const allDiffResults : {
        relativePath : string,
        declarationDiffs : diff.Change[],
        errorDiffs : diff.Change[],
    }[] = [];

    function diffFiles (actualPath : string, expectedPath : string) {
        if (!fs.existsSync(actualPath)) {
            return [];
        }
        const expectedData = fs.existsSync(expectedPath) ?
            fs.readFileSync(expectedPath).toString() :
            "";
        return diff.diffLines(
            expectedData,
            fs.readFileSync(actualPath).toString(),
            {
                ignoreCase : false,
                newlineIsToken : true,
            }
        ).filter(d => (
            d.removed === true ||
            d.added === true
        ));
    }
    //Now, we look for differences between the actual and expected
    for (const rootName of rootNames) {
        const relativePath = rootName
            .substr(inputRoot.length)
            .replace(".ts", "");

        const declarationDiffs = diffFiles(
            actualOutputRoot + relativePath + ".d.ts",
            expectedOutputRoot + relativePath + ".d.ts"
        );
        const errorDiffs = diffFiles(
            actualOutputRoot + relativePath + ".ts.errors",
            expectedOutputRoot + relativePath + ".ts.errors"
        );
        if (declarationDiffs.length > 0 || errorDiffs.length > 0) {
            allDiffResults.push({
                relativePath,
                declarationDiffs,
                errorDiffs,
            });
        }
    }
    return {
        rootNames,
        allDiffResults
    };
}

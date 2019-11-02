import * as ts from "typescript";
import * as fs from "fs";
import * as diff from "diff";
import * as path from "path";

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
    const errorSrc = path.replace(".d.ts", ".ts.errors");
    const errorDst = toRootDir + relativePath.replace(".d.ts", ".ts.errors");
    if (fs.existsSync(errorSrc)) {
        const data = fs.readFileSync(errorSrc);
        fs.writeFileSync(
            errorDst,
            data
        );
    } else {
        if (fs.existsSync(errorDst)) {
            fs.unlinkSync(errorDst);
        }
    }
}
export function copyAllFilesAndDirectoriesSync (fromRootDir : string, toRootDir : string) {
    const paths = getAllTsFiles(fromRootDir, true);
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

export function runTest (ignoreErrorMessageText : boolean, files? : string[]) {
    removeAllFilesAndDirectoriesSync(actualOutputRoot);

    const rootNames = files == undefined ?
        getAllTsFiles(inputRoot, false) :
        files;
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
        function replaceAll (useEllipsis : boolean, prefix : string, str : string) : string {
            while (true) {
                const newStr = str.replace(
                    (
                        useEllipsis ?
                        prefix + "..." :
                        prefix
                    ),
                    ""
                );
                if (newStr == str) {
                    return str;
                }
                str = newStr;
            }
        }
        function toRelativePath (str : string) : string {
            let prefix = path.normalize(__dirname + "/../../");
            let useEllipsis = false;
            while (prefix.length > 5) {
                let newStr = replaceAll(
                    useEllipsis,
                    prefix,
                    str
                );
                if (newStr == str) {
                    if (!useEllipsis) {
                        useEllipsis = true;
                        newStr = replaceAll(
                            useEllipsis,
                            prefix,
                            str
                        );
                    }
                }
                str = newStr;
                prefix = prefix.substr(0, prefix.length-1);
            }
            return str;
        }
        function useRelativePath (
            obj : ts.DiagnosticMessageChain
        ) : ts.DiagnosticMessageChain {
            if ("next" in obj) {
                return {
                    ...obj,
                    messageText : toRelativePath(obj.messageText),
                    next : (
                        obj.next == undefined ?
                        undefined :
                        useRelativePath(obj.next)
                    ),
                };
            } else {
                return {
                    ...obj,
                    messageText : toRelativePath(obj.messageText),
                };
            }
        }
        let err = errorDict[fileName];
        if (err != undefined) {
            err = err.map(obj => {
                return {
                    ...obj,
                    messageText : (
                        typeof obj.messageText == "string" ?
                        toRelativePath(obj.messageText) :
                        useRelativePath(obj.messageText)
                    ),
                };
            });
        }
        fs.writeFileSync(
            actualOutputRoot + "/" + fileName + ".errors",
            JSON.stringify(err, null, 2)
        );
    });

    const allDiffResults : {
        relativePath : string,
        inputPath : string,
        actualDeclarationOutputPath : string,
        expectedDeclarationOutputPath : string,
        actualErrorOutputPath : string,
        expectedErrorOutputPath : string,
        declarationDiffs : diff.Change[],
        errorDiffs : diff.Change[],
    }[] = [];

    function diffFiles (actualPath : string, expectedPath : string, transformer? : (str : string) => string) {
        let actualData = fs.existsSync(actualPath) ?
            fs.readFileSync(actualPath).toString() :
            "";
        let expectedData = fs.existsSync(expectedPath) ?
            fs.readFileSync(expectedPath).toString() :
            "";
        if (transformer != undefined) {
            actualData = transformer(actualData);
            expectedData = transformer(expectedData);
        }
        return diff.diffLines(
            expectedData,
            actualData,
            {
                ignoreCase : false,
                newlineIsToken : true,
            }
        ).filter(d => (
            d.removed === true ||
            d.added === true
        ));
    }
    /**
     * @todo Figure out why I called it `rootName`
     */
    //Now, we look for differences between the actual and expected
    for (const rootName of rootNames) {
        const relativePath = rootName
            .substr(inputRoot.length)
            .replace(".ts", "");

        const actualDeclarationOutputPath = actualOutputRoot + relativePath + ".d.ts";
        const expectedDeclarationOutputPath = expectedOutputRoot + relativePath + ".d.ts";

        const declarationDiffs = diffFiles(
            actualDeclarationOutputPath,
            expectedDeclarationOutputPath,
        );

        const actualErrorOutputPath = actualOutputRoot + relativePath + ".ts.errors";
        const expectedErrorOutputPath = expectedOutputRoot + relativePath + ".ts.errors";

        const errorDiffs = diffFiles(
            actualErrorOutputPath,
            expectedErrorOutputPath,
            (
                ignoreErrorMessageText ?
                (str) => {
                    if (str == "") {
                        return "";
                    }
                    const errorArr : {
                        messageText: string | ts.DiagnosticMessageChain;
                        category: ts.DiagnosticCategory;
                        code: number;
                        length: number | undefined;
                        start: number | undefined;
                    }[] = JSON.parse(str);
                    const newErrorArr = errorArr.map(obj => {
                        if (typeof obj.messageText == "string") {
                            delete obj.messageText;
                        } else {
                            let cur : ts.DiagnosticMessageChain|undefined = obj.messageText;
                            while (cur != undefined) {
                                delete cur.messageText;
                                cur = cur.next;
                            }
                        }
                        return obj;
                    });
                    return JSON.stringify(newErrorArr, null, 2);

                }:
                undefined
            )
        );
        if (declarationDiffs.length > 0 || errorDiffs.length > 0) {
            allDiffResults.push({
                relativePath,
                inputPath : rootName,
                actualDeclarationOutputPath,
                expectedDeclarationOutputPath,
                actualErrorOutputPath,
                expectedErrorOutputPath,
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

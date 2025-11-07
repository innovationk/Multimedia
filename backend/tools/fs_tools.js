import { existsSync, readdirSync, lstatSync, readFileSync, mkdirSync, writeFileSync, cpSync, unlinkSync, appendFileSync } from 'node:fs';
import path from 'node:path';

export default class FsTools {
    static getFilesPaths({ inputPath, recursive = true, whitelist = ["*"], output = [] }) {
        if (existsSync(inputPath)) {
            const files = readdirSync(inputPath);

            for (const file of files) {
                const filePath = `${inputPath}/${file}`;

                if (lstatSync(filePath).isDirectory()) {
                    this.getFilesPaths({ inputPath: filePath, recursive: recursive, whitelist: whitelist, output: output });

                } else {
                    if (whitelist[0] === "*") {
                        output.push(filePath);
                    } else {

                        let add = false;
                        for (const whiteKey of whitelist) {
                            add |= file.includes(whiteKey);
                        }
                        if (add) {
                            output.push(filePath);
                        }

                    }
                }
            }
        }

        return output;
    }

    static getDirectoriesPaths({ inputPath, recursive = true, whitelist = ["*"], output = [] }) {
        if (existsSync(inputPath)) {
            const files = readdirSync(inputPath);

            for (const file of files) {
                const filePath = `${inputPath}/${file}`;

                if (lstatSync(filePath).isDirectory()) {
                    let shouldPush = whitelist[0] === "*";
                    if (!shouldPush) {
                        for (const whiteKey of whitelist) {
                            shouldPush |= file.includes(whiteKey);
                        }
                    }

                    if (shouldPush) {
                        output.push(filePath);
                    }

                    if (recursive) {
                        this.getFilesPaths({ inputPath: filePath, recursive: recursive, whitelist: whitelist, output: output });
                    }
                }
            }
        }

        return output;
    }

    static writeFile({ inputPath, data }) {
        if (existsSync(inputPath)) {
            unlinkSync(inputPath);
        }

        mkdirSync(path.dirname(inputPath), { recursive: true });
        writeFileSync(inputPath, data);
    }

    static appendToFile({ inputPath, data }) {
        mkdirSync(path.dirname(inputPath), { recursive: true });
        appendFileSync(inputPath, data);
    }

    static fileToBase64({ inputPath }) {
        let output;

        if (existsSync(inputPath)) {
            output = readFileSync(inputPath, { encoding: "base64" });
        } else {
            console.error(`File not found: ${inputPath}`)
        }

        return output;
    }

    static saveImageBase64FileSync({ base64Str, dirPath, fileName }) {
        const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '');
        const outputPath = `${dirPath}/${fileName}`;
        try {
            if (!existsSync(dirPath)) {
                mkdirSync(dirPath, { recursive: true });
            }
            writeFileSync(outputPath, base64Data, 'base64');
            return outputPath;
        } catch (error) {
            console.error(`Failed to save ${outputPath}: ${error.message}`);
        }
    };

    static copyDir({ inputDirPath, outputDirPath }) {
        cpSync(inputDirPath, outputDirPath, { recursive: true });
    };

    static csvToArray({ inputPath, separator = "," }) {
        let output = [];

        if (existsSync(inputPath)) {
            const rawData = readFileSync(inputPath, { encoding: "utf8" });
            const rows = rawData.split(/\r?\n/);
            for (const row of rows) {
                const cols = row.split(separator);
                if (cols.length > 0) {
                    output.push(cols);
                }
            }
        } else {
            console.error(`File not found: ${inputPath}`);
        }

        return output;
    }

    static csvToArrayObjects({ inputPath, separator = "," }) {
        let output = [];

        if (existsSync(inputPath)) {
            const rawData = readFileSync(inputPath, { encoding: "utf8" });
            const lines = rawData.split(/\r?\n/);
            output = this.csvLinesToArrayObjects({ lines: lines, separator: separator });
        } else {
            console.error(`File not found: ${inputPath}`);
        }

        return output;
    }


    static csvLinesToArrayObjects({ lines, separator = ',' }) {
        let output = [];

        let fields = [];
        for (let iCol = 0; iCol < lines[0].length; ++iCol) {
            const headerRow = lines[0].split(separator);
            if (headerRow[iCol]) {
                fields[iCol] = headerRow[iCol].trim();
            }
        }

        for (let iRow = 1; iRow < lines.length; ++iRow) {
            const cols = lines[iRow].split(separator);

            if (cols[0].length > 0) {
                let row = {};
                for (let iCol = 0; iCol < fields.length; ++iCol) {
                    row[fields[iCol]] = cols[iCol].trim();
                }
                if (Object.keys(row).length > 0) {
                    output.push(row);
                }
            }
        }

        return output;
    }
}